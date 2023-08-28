import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function PaymentModal({ handlePayment, closeModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      handlePayment(paymentMethod.id);
      closeModal();
      navigate("/dashboard");
    }
  };

  return (
    <div className="payment-modal">
      <form onSubmit={handleSubmit}>
        <div
          style={{
            borderRadius: "8px",
            padding: "10px",
            background: "white",
          }}
        >
          <CardElement
            options={{ hidePostalCode: true }}
            style={{
              base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
                border: "1px solid #aab7c4", // Add this for a border
                borderRadius: "4px",
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            }}
          />
        </div>
        <button type="submit" disabled={!stripe || processing}>
          Confirm Payment
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default PaymentModal;
