const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

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
