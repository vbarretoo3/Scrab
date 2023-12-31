import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../imgs/Logomark(simple).svg";
import { Link } from "react-router-dom";

function PublicHeader() {
  const navigate = useNavigate();

  return (
    <div className="header-container">
      <div className="header-right">
        <Link to="/">
          <img className="logo" src={logo} alt="Scrab" />
        </Link>
        <div className="header-menu">
          <a href="/solutions">Solutions</a>
          <a href="/pricing">Princing</a>
          <a href="/resources">Resources</a>
        </div>
      </div>
      <div className="header-left">
        <a href="/login">Login</a>
        <button onClick={() => navigate("/signup")} className="button-pill">
          Start Free Trial
        </button>
      </div>
    </div>
  );
}

export default PublicHeader;
