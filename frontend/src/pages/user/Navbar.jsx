import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../style/user/navbar.css";
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="container">
       <Link className="navbar-brand" to="/userdashboard">
          <div className="home-logo-container">
            <span className="home-logo-spin">SPIN</span>
            <span className="home-logo-city">City</span>
            <div className="logo-tagline">
              Sustainable Personal Innovation Network
            </div>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/userdashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rentcycle">
                Rent Cycle
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ridehistory">
                Ride History
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userprofile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn-custom" to="/login">
                Logout
              </Link>
            </li>{" "}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
