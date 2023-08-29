import React, { useState } from "react";
import { httpsCallable } from "firebase/functions"; // make sure you import from 'firebase/functions', not 'firebase-admin/functions'
import { db, functions } from "../context/firebase";
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const companyRefId = JSON.parse(sessionStorage.getItem("company")).id;
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Notes: "",
    Permission: "",
    CompanyId: companyRefId,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createUserFunction = httpsCallable(functions, "createUser");

    try {
      const result = await createUserFunction(formData);
      window.location.reload();
    } catch (error) {
      setMessage("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-modal-container">
      <div className="staff-name-wrap-editable">
        <div style={{ display: "flex" }}>
          <label htmlFor="FirstName">First Name:</label>
          <input
            type="text"
            name="FirstName" // <-- Fixed here
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        <div style={{ display: "flex" }}>
          <label htmlFor="LastName">Last Name:</label>
          <input
            type="text"
            name="LastName" // <-- Fixed here
            value={formData.LastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="Email">Email:</label>
        <input
          style={{ width: "100%" }}
          type="email"
          name="Email" // <-- Fixed here
          value={formData.Email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        <label htmlFor="Permission">Permission:</label>
        <input
          style={{ width: "100%" }}
          type="text"
          name="Permission" // <-- Fixed here
          value={formData.Permission}
          onChange={handleChange}
          placeholder="Permission"
          required
        />
      </div>
      <div>
        <label htmlFor="Notes">Notes:</label>
        <textarea
          style={{ width: "100%", height: "50px" }}
          type="text"
          name="Notes" // <-- Fixed here
          value={formData.Notes}
          onChange={handleChange}
          placeholder="Notes"
        />
      </div>
      <button className="button-pill" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      {message}
    </div>
  );
};

export default CreateUser;
