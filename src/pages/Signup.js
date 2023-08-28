import React, { useState } from "react";
import { auth, db } from "../context/firebase"; // Assuming you've set up Firebase in a 'firebaseConfig' file
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Create user with email and password using Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;
    const currentDateStr = formatDate(new Date());
    try {
      // Add company document to Firestore
      const companyRef = await addDoc(collection(db, "Company"), {
        companyName: formData.companyName,
        SubscriptionStatus: "Trial",
        CustomerSince: currentDateStr,
        Trial: true,
      });

      // Use user UID as document ID for Firestore user document
      await setDoc(doc(db, "Users", user.uid), {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        email: formData.email,
        Notes: "",
        Permission: "Admin",
        Role: "Owner",
        Company: companyRef,
        CreatedAt: currentDateStr,
      });

      // Create and delete placeholder in Timesheet subcollection
      const timesheetDocRef = doc(
        collection(companyRef, "Timesheet"),
        currentDateStr
      );

      await setDoc(timesheetDocRef, {
        date: currentDateStr,
        shifts: [],
      });

      navigate("/plans");
    } catch (error) {
      console.error("error during signup:", error);
    }
  };

  return (
    <>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-fields">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-fields">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-fields">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            required
          />
        </div>
        <div></div>
        <div className="signup-fields">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-fields">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div></div>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default Signup;
