import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../style/user/navbar.css";
import logout from "../../service/logout";
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
              <button
                type="button"
                className="nav-link btn-custom"
                onClick={logout}
              >
                Logout
              </button>
            </li>{" "}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
