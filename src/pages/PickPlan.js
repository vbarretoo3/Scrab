import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { db, functions } from "../context/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import PaymentModal from "../components/PaymentModal"; // assuming you have a modal component for payment details
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Modal from "react-modal";

function PickPlan() {
  const [loading, setLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({
    planId: "",
    planName: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const createStripeCheckout = httpsCallable(functions, "createStripeCheckout");
  const { currentUser } = useAuth();
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userRef = doc(db, "Users", currentUser.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists) {
          console.error("User does not exist!");
          return;
        }

        const companyId = userData.data().Company.id;
        setCustomer(companyId);
        const companyRef = doc(db, "Company", companyId);

        const unsubscribe = onSnapshot(companyRef, (snapshot) => {
          const companyData = snapshot.data();

          if (companyData.stripeCustomerId) {
            setStripeCustomerId(companyData.stripeCustomerId);
            setLoading(false);
          }
        });

        return () => unsubscribe();
      }
    };

    fetchData(); // Call the async function
  }, [currentUser, db]);

  async function handlePayment(paymentMethodId) {
    const cart = {
      companyId: customer,
      planId: selectedPlan.planId,
      customerId: stripeCustomerId,
      planName: selectedPlan.planName,
      cardToken: paymentMethodId, // Now directly using the passed value
    };

    createStripeCheckout(cart)
      .then((response) => {
        if (response.data.status === "active") {
          // Post subscription logic here...
        } else {
          // Handle other statuses or errors...
        }
      })
      .catch((error) => {
        console.error("Error calling the function:", error);
      });
  }

  function openPaymentModal(planId, planName) {
    setSelectedPlan({ planId, planName });
    setModalOpen(true);
  }

  return (
    <div>
      <div className="plan-container">
        <div className="card-container">
          <div className="card basic">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Basic</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Ideal for small companies with less than 5 employees looking to
              make scheduling easier for them and their employees
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "28pt", margin: "0px" }}>$20</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "12pt",
                    margin: "0px",
                    textAlign: "left",
                    paddingLeft: "5px",
                  }}
                >
                  CAD
                </h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; Schedulling for up to 5 team member</p>
              <p>&#10003; Customized Permissions</p>
              <p>&#10003; Set up Roles for your Staff</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() =>
                openPaymentModal("price_1NjDbNHH3lsZV3YgzFzwCyTL", "Basic Plan")
              }
            >
              Chose your plan!
            </button>
          </div>
          <div className="card advanced">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Advanced</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Perfect for your small and medium companies with less than 20 team
              members looking for payroll and schedulling solutions with reports
              available
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "28pt", margin: "0px" }}>$50</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "12pt",
                    margin: "0px",
                    textAlign: "left",
                    paddingLeft: "5px",
                  }}
                >
                  CAD
                </h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; All Features from the advanced plan</p>
              <p>&#10003; Schedulling for up to 20 team member</p>
              <p>&#10003; Basic payroll tools</p>
              <p>&#10003; Basic reports</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() =>
                openPaymentModal(
                  "price_1NjDbNHH3lsZV3YgqRuXFh4v",
                  "Advanced Plan"
                )
              }
            >
              Chose your plan!
            </button>
          </div>
          <div className="card premium">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Premium</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Recommended for larger companies looking for more complex reports
              with multiple locations and more than 20 team members
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "28pt", margin: "0px" }}>$120</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "12pt",
                    margin: "0px",
                    textAlign: "left",
                    paddingLeft: "5px",
                  }}
                >
                  CAD
                </h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; All Features from the Advanced Plan</p>
              <p>&#10003; Schedulling for up to 50 team member</p>
              <p>&#10003; Set up multiple locations</p>
              <p>&#10003; Acess to custom reports</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() =>
                openPaymentModal(
                  "price_1NjDbNHH3lsZV3YgK2or42Iz",
                  "Premium Plan"
                )
              }
            >
              Chose your plan!
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} className="schedule-modal">
          <div onClick={() => setModalOpen(false)}>X</div>
          <Elements stripe={stripePromise}>
            <PaymentModal
              handlePayment={handlePayment}
              closeModal={() => setModalOpen(false)}
            />
          </Elements>
        </Modal>
      )}
    </div>
  );
}

export default PickPlan;
