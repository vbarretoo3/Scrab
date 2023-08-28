const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();
// eslint-disable-next-line new-cap
const stripe = Stripe(functions.config().stripe.secret_key);

exports.updateUserName = functions.firestore
  .document("Users/{userId}")
  .onUpdate((change, context) => {
    const { after, before } = change;
    const newValue = after.data();
    const previousValue = before.data();

    if (!newValue || !previousValue) {
      console.error("Document data not found.");
      return null;
    }

    if (
      newValue.FirstName !== previousValue.FirstName ||
      newValue.LastName !== previousValue.LastName
    ) {
      const updatedName = `${newValue.FirstName} ${newValue.LastName}`;
      const companyRef = newValue.Company;

      if (!companyRef) {
        console.error("Company reference not found.");
        return null;
      }

      // Get the Timesheet docs from the Company document
      return db
        .collection(`Company/${companyRef.id}/Timesheet`)
        .get()
        .then((timesheetsSnapshot) => {
          const batchWrite = db.batch();

          timesheetsSnapshot.forEach((docSnap) => {
            const timesheet = docSnap.data();
            const updatedShifts = timesheet.shifts.map((shift) => {
              if (shift.id === context.params.userId) {
                shift.UserName = updatedName;
              }
              return shift;
            });

            batchWrite.update(docSnap.ref, { shifts: updatedShifts });
          });

          return batchWrite.commit();
        })
        .catch((error) => {
          console.error("Error updating names:", error);
          return null;
        });
    }

    return null;
  });

exports.createUser = functions.https.onCall(async (data, context) => {
  const { Email, FirstName, LastName, CompanyId, Notes, Permission } = data;

  // Create user with Firebase Admin SDK
  const userRecord = await admin.auth().createUser({
    email: Email,
  });

  const companyRef = admin.firestore().doc(`Company/${CompanyId}`);

  const uid = userRecord.uid;

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so +1 is added.
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  // Add user to Firestore with the same UID
  const userRef = admin.firestore().collection("Users").doc(uid);
  await userRef.set({
    FirstName: FirstName,
    LastName: LastName,
    Email: Email,
    Company: companyRef,
    Permission: Permission,
    Role: "Staff",
    Notes: Notes,
    CreatedAt: formatDate(new Date()),
  });

  return { success: true, uid: uid };
});

exports.createStripeUser = functions.firestore
  .document("Company/{companyId}")
  .onCreate(async (snap, context) => {
    try {
      const companyData = snap.data();

      // Create a new customer in Stripe.
      const customer = await stripe.customers.create({
        name: companyData.companyName, // Assuming the company document has a 'name' field.
      });

      // Store the Stripe customer ID in Firestore.
      return snap.ref.set({ stripeCustomerId: customer.id }, { merge: true });
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      // Handle or rethrow the error as needed
      throw new functions.https.HttpsError(
        "internal",
        // eslint-disable-next-line
        "Failed to create Stripe customer."
      );
    }
  });

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(data.cardToken, {
      customer: data.customerId,
    });

    // Retrieve the company document
    const companyRef = db.collection("Company").doc(data.companyId);
    const companyDoc = await companyRef.get();

    if (!companyDoc.exists) {
      throw new Error("Company does not exist.");
    }

    const companyData = companyDoc.data();

    // Define the subscription object
    const subscriptionObj = {
      customer: data.customerId,
      items: [{ price: data.planId }],
      default_payment_method: data.cardToken,
    };

    // Check if the company is eligible for a trial
    if (companyData.Trial) {
      const trialEnd = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60; // 14 days from now
      subscriptionObj.trial_end = trialEnd;
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create(subscriptionObj);

    // If the company had a trial, set the Trial field to false
    if (companyData.Trial) {
      await companyRef.update({
        Trial: false,
        Plan: data.planName,
      });
    }

    return { id: subscription.id };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError(
      "unknown",
      "Stripe checkout failed",
      // eslint-disable-next-line
      error.message
    );
  }
});

exports.subscriptionUpdate = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      // eslint-disable-next-line
      functions.config().stripe.subscription_update_webhook_secret
    );
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const handleInvoicePaymentStatus = async (status) => {
    try {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      const companySnapshot = await admin
        .firestore()
        .collection("Company")
        .where("stripeCustomerId", "==", customerId)
        .get();

      if (!companySnapshot.empty) {
        const companyDoc = companySnapshot.docs[0];
        await companyDoc.ref.update({
          SubscriptionStatus: status,
          lastInvoiceDate: admin.firestore.Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error in handleInvoicePaymentStatus:", error);
      return res.status(500).send("Internal Server Error");
    }
  };

  if (event.type === "invoice.payment_succeeded") {
    await handleInvoicePaymentStatus("Active");
  } else if (event.type === "invoice.payment_failed") {
    await handleInvoicePaymentStatus("Delayed");
  }

  return res.sendStatus(200); // Responding to Stripe after processing
});

exports.checkDelayedSubscriptions = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const fiveDaysAgo = admin.firestore.Timestamp.fromDate(
      // eslint-disable-next-line
      new Date(now.toDate() - 5 * 24 * 60 * 60 * 1000)
    );

    const companiesRef = admin.firestore().collection("Company");
    const delayedCompanies = await companiesRef
      .where("subscriptionStatus", "==", "Delayed")
      .get();

    delayedCompanies.forEach(async (doc) => {
      const company = doc.data();
      if (company.lastInvoiceDate && company.lastInvoiceDate < fiveDaysAgo) {
        await companiesRef.doc(doc.id).update({
          subscriptionStatus: "Inactive",
        });
      }
    });

    console.log("Subscription status check completed!");
    return null;
  });
