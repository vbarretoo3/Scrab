import React, { useEffect, useState } from "react";
import StaffMember from "../components/StaffMember";
import StaffEdit from "../components/StaffEdit";
import Modal from "react-modal";

function Staff() {
  const team = JSON.parse(sessionStorage.getItem("companyUsers"));
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const staffCount = JSON.parse(sessionStorage.getItem("companyUsers")).length;
  const companyData = JSON.parse(sessionStorage.getItem("company"));
  const plan = companyData.Plan;
  const [staffLimit, setStaffLimit] = useState(5);

  useEffect(() => {
    if (plan === "Basic Plan") {
      setStaffLimit(5);
    } else if (plan === "Advanced Plan") {
      setStaffLimit(15);
    } else if (plan === "Premium Plan") {
      setStaffLimit(50);
    }
  }, [plan]);

  const handleModal = (staff) => {
    if (isModalOpen) {
      setModalOpen(false);
    } else {
      setSelectedStaff(staff);
      setModalOpen(true);
    }
  };

  const handleStaffChange = (updatedStaff) => {
    setSelectedStaff(updatedStaff);
  };

  return (
    <div className="protected-route-container">
      <h3>Staff</h3>
      <div
        style={{
          justifyContent: "flex-start",
          display: "flex",
          marginLeft: "40px",
          marginTop: "20px",
          flexFlow: "column",
        }}
      >
        <strong style={{ textAlign: "left" }}>
          Your current team count is {staffCount} out of {staffLimit}
        </strong>
        {staffCount >= staffLimit && (
          <div style={{ justifyContent: "flex-start", display: "flex" }}>
            <br />
            You are currently in your team limit upgrade your plan on your
            settings to add more team members
          </div>
        )}
      </div>
      <br />
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
        {staffCount < staffLimit && (
          <div
            className="staff-settings-card"
            onClick={() => handleModal("new")}
          >
            Add Staff Member
          </div>
        )}
        <Modal className="staff-modal" isOpen={isModalOpen}>
          <StaffEdit
            staff={selectedStaff}
            onStaffChange={handleStaffChange}
            handleModal={setModalOpen}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Staff;
