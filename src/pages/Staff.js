import React, { useState } from "react";
import StaffMember from "../components/StaffMember";
import StaffEdit from "../components/StaffEdit";
import Modal from "react-modal";

function Staff() {
  const team = JSON.parse(sessionStorage.getItem("companyUsers"));
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);

  const handleModal = (staff) => {
    if (isModalOpen) {
      setModalOpen(false);
    } else {
      setSelectedStaff(staff);
      setModalOpen(true);
    }
  };

  return (
    <div className="protected-route-container">
      <h3>Staff</h3>
      <div className="staff-settings-container">
        {team.map((staff) => (
          <div
            key={staff.id}
            onClick={() => {
              handleModal(staff);
            }}
          >
            <StaffMember staff={staff} />
          </div>
        ))}
        <div className="staff-settings-card" onClick={() => handleModal("new")}>
          Add Staff Member
        </div>
        <Modal className="staff-modal" isOpen={isModalOpen}>
          <StaffEdit staff={selectedStaff} handleModal={setModalOpen} />
        </Modal>
      </div>
    </div>
  );
}

export default Staff;
