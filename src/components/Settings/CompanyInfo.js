import React from "react";

function CompanyInfo() {
  const company = JSON.parse(sessionStorage.getItem("company"));
  const reformat = (date) => {
    const [year, month, day] = date.split("-");
    const reformattedDate = `${day}/${month}/${year}`;
    return reformattedDate;
  };

  return (
    <div>
      Company Info
      <p>Company Name: {company.companyName}</p>
      <p>Member Since: {reformat(company.CustomerSince)}</p>
    </div>
  );
}

export default CompanyInfo;
