import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import config from "./config";

const Navbar = () => {
  const companyName = config.COMPANY_NAME;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="company-name">{companyName}</div>
    </nav>
  );
};

export default Navbar;
