import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth"; // adjust path accordingly
import { db, functions } from "../context/firebase";
import Loading from "../components/Loading";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { httpsCallable } from "firebase/functions";

function PickPlan() {
  const [loading, setLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const createStripeCheckout = httpsCallable(functions, "createStripeCheckout");
  const { currentUser } = useAuth(); // Assuming useAuth returns the current authenticated user.

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

  if (loading) {
    return <Loading />; // Replace with your loading component.
  }

  async function handleCheckout(planId) {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

    const cart = {
      planId: planId,
      customerId: stripeCustomerId,
    };

    createStripeCheckout(cart)
      .then((response) => {
        const sessionId = response.data.id;
        stripe.redirectToCheckout({ sessionId: sessionId });
      })
      .catch((error) => {
        console.error("Error calling the function:", error);
      });
  }

  return (
    <div>
      <div className="plan-container">
        <button
          className="button-pill"
          onClick={() => handleCheckout("price_1NjDbNHH3lsZV3YgzFzwCyTL")}
        >
          Get Plan
        </button>
        <div className="plan-container"></div>
        <button
          className="button-pill"
          onClick={() => handleCheckout("price_1NjDbNHH3lsZV3YgqRuXFh4v")}
        >
          Get Plan
        </button>
        <div className="plan-container"></div>
        <button
          className="button-pill"
          onClick={() => handleCheckout("price_1NjDbNHH3lsZV3YgK2or42Iz")}
        >
          Get Plan
        </button>
      </div>
    </div>
  );
}

export default PickPlan;
