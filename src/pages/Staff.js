import React, { useState } from "react";
import StaffMember from "../components/StaffMember";
import Modal from "react-modal";

function Staff() {
  const team = JSON.parse(sessionStorage.getItem("companyUsers"));
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    if (isModalOpen) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="protected-route-container">
      <h3>Staff</h3>
      {team.map((staff) => (
        <StaffMember key={staff.id} staff={staff} />
      ))}
      <div onClick={handleModal}>Add Staff Member</div>
      <Modal isOpen={isModalOpen}>
        <div onClick={handleModal}>X</div>
      </Modal>
    </div>
  );
}

export default Staff;
