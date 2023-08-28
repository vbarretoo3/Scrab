import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsFillPencilFill } from "react-icons/bs";
import CreateUser from "../pages/CreateUser";

function StaffEdit({ staff, handleModal }) {
  const [isEditable, setIsEditable] = useState(false);
  const handleSave = () => {
    setIsEditable(false);
  };

  return (
    <div className="staff-modal-container">
      <div className="icon-wrap">
        <IoMdClose
          className="close-icon"
          style={{ scale: "1.7" }}
          onClick={() => handleModal(false)}
        />
        {staff !== "new" && (
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
          <div className="staff-name-wrap">
            <div>First Name: {staff.FirstName}</div>
            <div>Last Name: {staff.LastName}</div>
          </div>
          Email: {staff.Email}
          Permission: {staff.Permission}
          <div>Notes: {staff.Notes}</div>
          {isEditable && (
            <button className="button-pill" onClick={handleSave}>
              Save
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default StaffEdit;
