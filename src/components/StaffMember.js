import React from "react";

function StaffMember(staff) {
  const staffMember = staff.staff;
  return (
    <div>
      <p>
        {staffMember.FirstName} {staffMember.LastName}
      </p>
    </div>
  );
}

export default StaffMember;
