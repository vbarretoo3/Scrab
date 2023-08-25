import React, { useState } from "react";
import { httpsCallable } from "firebase/functions"; // make sure you import from 'firebase/functions', not 'firebase-admin/functions'
import { db, functions } from "../context/firebase";
import { doc } from "firebase/firestore";

const Staff = () => {
  const companyRefId = JSON.parse(sessionStorage.getItem("company")).id;
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    CompanyId: companyRefId,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Here, 'createUser' is the name you've exported your cloud function as
    const createUserFunction = httpsCallable(functions, "createUser");

    try {
      const result = await createUserFunction(formData);
      // Handle result (if needed)
      setMessage("User created successfully! UID: " + result.data.uid);
    } catch (error) {
      setMessage("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="FirstName" // <-- Fixed here
        value={formData.FirstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="LastName" // <-- Fixed here
        value={formData.LastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        name="Email" // <-- Fixed here
        value={formData.Email}
        onChange={handleChange}
        placeholder="Email Address"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      <p>{message}</p>
    </form>
  );
};

export default Staff;
