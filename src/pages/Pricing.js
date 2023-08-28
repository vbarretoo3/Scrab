import { useNavigate } from "react-router-dom";

function PickPlan() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div>
      <div className="plan-container">
        <div className="card-container">
          <div className="card basic">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Basic</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Ideal for small companies with less than 5 employees looking to
              make scheduling easier for them and their employees
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "24pt", margin: "0px" }}>$20</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ fontSize: "12pt", margin: "0px" }}>CAD</h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; Schedulling for up to 5 team member</p>
              <p>&#10003; Customized Permissions</p>
              <p>&#10003; Set up Roles for your Staff</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() => handleClick}
            >
              Try for free!
            </button>
          </div>
          <div className="card advanced">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Advanced</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Perfect for your small and medium companies with less than 20 team
              members looking for payroll and schedulling solutions with reports
              available
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "24pt", margin: "0px" }}>$50</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ fontSize: "12pt", margin: "0px" }}>CAD</h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; All Features from the advanced plan</p>
              <p>&#10003; Schedulling for up to 20 team member</p>
              <p>&#10003; Basic payroll tools</p>
              <p>&#10003; Basic reports</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() => handleClick}
            >
              Try for free!
            </button>
          </div>
          <div className="card premium">
            <h2 style={{ fontSize: "30pt", margin: "0px" }}>Premium</h2>
            <p style={{ fontSize: "10pt" }}>
              {" "}
              Recommended for larger companies looking for more complex reports
              with multiple locations and more than 20 team members
            </p>
            <div style={{ display: "flex" }}>
              <h4 style={{ fontSize: "24pt", margin: "0px" }}>$120</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ fontSize: "12pt", margin: "0px" }}>CAD</h3>
                <h2 style={{ fontSize: "12pt", margin: "0px" }}>/month</h2>
              </div>
            </div>
            <div className="card-text">
              <p>&#10003; All Features from the Advanced Plan</p>
              <p>&#10003; Schedulling for up to 50 team member</p>
              <p>&#10003; Set up multiple locations</p>
              <p>&#10003; Acess to custom reports</p>
            </div>
            <button
              className="button-pill card-button"
              onClick={() => handleClick}
            >
              Try for free!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickPlan;
