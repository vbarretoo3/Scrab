import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsFillPencilFill } from "react-icons/bs";
import CreateUser from "./CreateUser";
import { db } from "../context/firebase";
import { updateDoc, doc } from "firebase/firestore";

function StaffEdit({ staff, onStaffChange, handleModal }) {
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedStaff = {
      ...staff,
      [name]: value,
    };
    onStaffChange(updatedStaff);
  };

  const handleSave = async () => {
    // Update the local storage
    const companyUsers = JSON.parse(sessionStorage.getItem("companyUsers"));
    const updatedUsers = companyUsers.map((user) =>
      user.id === staff.id ? { ...user, ...staff } : user
    );
    sessionStorage.setItem("companyUsers", JSON.stringify(updatedUsers));

    // Exclude the id field from the staff object
    const { id, Company, ...staffWithoutUserId } = staff;

    // Reconstruct the DocumentReference for Company based on the retrieved data
    // Assuming Company object has _path property which contains the path segments
    const companyRef = doc(db, "Company", Company._key.path.segments[6]);

    const staffForDatabase = {
      ...staffWithoutUserId,
      Company: companyRef,
    };

    const staffDocRef = doc(db, "Users", staff.id);
    await updateDoc(staffDocRef, staffForDatabase);
    window.location.reload();
  };

  const handleDelete = async () => {
    // Remove from local storage
    const companyUsers = JSON.parse(sessionStorage.getItem("companyUsers"));
    const updatedUsers = companyUsers.filter((user) => user.id !== staff.id);
    sessionStorage.setItem("companyUsers", JSON.stringify(updatedUsers));

    // Remove the company reference from the Firestore document
    const staffDocRef = doc(db, "Users", staff.id);
    await updateDoc(staffDocRef, { Company: null }); // Assuming you want to set the company field to null
    handleModal(false);
  };

  return (
    <div className="staff-modal-container">
      <div className="icon-wrap">
        <IoMdClose
          className="close-icon"
          style={{ scale: "1.7" }}
          onClick={() => handleModal(false)}
        />
        {staff !== "new" && !isEditable && (
          <BsFillPencilFill
            className="close-icon"
            onClick={() => setIsEditable(true)}
          />
        )}
      </div>
      <br />
      {staff === "new" ? (
        <CreateUser />
      ) : (
        <>
          {isEditable ? (
            <>
              <div style={{ display: "flex" }}>
                <label htmlFor="FirstName">First Name:</label>
                <input
                  type="text"
                  name="FirstName"
                  onChange={handleChange}
                  defaultValue={staff.FirstName}
                  required
                />
              </div>
              <div style={{ display: "flex" }}>
                <label htmlFor="LastName">Last Name:</label>
                <input
                  type="text"
                  name="LastName"
                  onChange={handleChange}
                  defaultValue={staff.LastName}
                  required
                />
              </div>
              <div>
                <label htmlFor="Email">Email:</label>
                <input
                  style={{ width: "100%" }}
                  type="email"
                  name="Email"
                  onChange={handleChange}
                  defaultValue={staff.Email}
                  required
                />
              </div>
              {staff.Role === "Owner" ? (
                <div>Permission: Admin</div>
              ) : (
                <div>
                  {console.log(staff)}
                  <label htmlFor="Permission">Permission:</label>
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    name="Permission"
                    onChange={handleChange}
                    defaultValue={staff.Permission}
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="Notes">Notes:</label>
                <textarea
                  style={{ width: "100%", height: "50px" }}
                  type="text"
                  name="Notes"
                  onChange={handleChange}
                  defaultValue={staff.Notes}
                />
                <button className="button-pill" onClick={handleSave}>
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="staff-name-wrap">
                <div>First Name: {staff.FirstName}</div>
                <div>Last Name: {staff.LastName}</div>
              </div>
              <div>Email: {staff.email}</div>
              <div>Permission: {staff.Permission}</div>
              <div>Notes: {staff.Notes}</div>
              {staff.Role !== "Owner" && (
                <button
                  className="button-pill schedule-modal-button-delete"
                  style={{
                    width: "180px",
                    alignItems: "center",
                  }}
                  onClick={handleDelete}
                >
                  Delete User
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default StaffEdit;
