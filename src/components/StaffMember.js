import React from "react";

function StaffMember(staff) {
  const staffMember = staff.staff;
  return (
    <div className="staff-settings-card">
      <div>
        {staffMember.FirstName} {staffMember.LastName}
      </div>
      <div className="staff-settings-create-date">
        team member since: {staffMember.CreatedAt}
      </div>
    </div>
  );
}

export default StaffMember;
