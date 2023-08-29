import React from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

function Billing() {
  const companyInfo = JSON.parse(sessionStorage.getItem("company"));
  console.log(companyInfo.lastInvoiceDate);
  function handleCancel() {
    const functions = getFunctions();
    const cancelSubscription = httpsCallable(functions, "cancelSubscription");

    cancelSubscription()
      .then((result) => {
        console.log(result.data); // Process result.data if you return data from your function
        alert("Subscription canceled successfully.");
      })
      .catch((error) => {
        console.error("Error canceling subscription:", error);
        alert("Failed to cancel subscription. Please try again.");
      });
  }
  return (
    <div>
      Billing
      <div>Current plan: {companyInfo.Plan}</div>
      {companyInfo.lastInvoiceDate === undefined ? (
        <div>You are currently on your trial period</div>
      ) : (
        <div>Last invoice date: {companyInfo.lastInvoiceDate}</div>
      )}
      <button
        className="button-pill schedule-modal-button-delete"
        onClick={handleCancel}
      >
        Cancel Subscription
      </button>
    </div>
  );
}

export default Billing;
