import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import userService from "../../service/userService";
import "../../style/user/ridehistory.css";
import { Link } from "react-router-dom";
const RideHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await userService.getRentalHistory(customerId);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (customerId) fetchHistory();
  }, [customerId]);

  const getCycleTypeName = (type) => {
    const types = {
      1: "Gear", 2: "Non-Gear", 3: "Kids",
      4: "Women", 5: "City", 6: "Electric",
    };
    return types[type] || type || "Cycle";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Completed": return { color: "status-completed", label: "Completed", dot: "#22c55e" };
      case "Active":    return { color: "status-active",    label: "Active",    dot: "#3b82f6" };
      case "Cancelled": return { color: "status-cancelled", label: "Cancelled", dot: "#ef4444" };
      default:          return { color: "status-default",   label: status,      dot: "#94a3b8" };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case "Success": return { color: "pay-success", label: "Paid" };
      case "Pending": return { color: "pay-pending", label: "Pending" };
      case "Failed":  return { color: "pay-failed",  label: "Failed" };
      default:        return { color: "pay-default", label: status };
    }
  };

  const filters = ["All", "Completed", "Active", "Cancelled"];

  const filteredHistory = history
    .filter((r) => filter === "All" || r.rentalStatus === filter)
    .filter((r) =>
      searchTerm === "" ||
      r.cycleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pickupStation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.returnStation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Stats
  const totalRides = history.filter((r) => r.rentalStatus === "Completed").length;
  const totalSpent = history
    .filter((r) => r.rentalStatus === "Completed")
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalMinutes = history
    .filter((r) => r.rentalStatus === "Completed")
    .reduce((sum, r) => sum + (r.rentalDuration || 0), 0);

  return (
    <div className="rh-page">
      <Navbar />

      {/* Hero Header */}
      <div className="rh-hero">
        <div className="rh-hero-bg">
          <div className="rh-hero-circle c1" />
          <div className="rh-hero-circle c2" />
          <div className="rh-hero-circle c3" />
        </div>
        <div className="rh-hero-content">
          <span className="rh-hero-tag">Your Journey</span>
          <h1 className="rh-hero-title">Ride History</h1>
          <p className="rh-hero-sub">Every pedal, every path, every memory</p>
        </div>

        {/* Stats Row */}
        <div className="rh-stats-row">
          <div className="rh-stat-pill">
            <span className="rh-stat-icon">🚲</span>
            <div>
              <span className="rh-stat-num">{totalRides}</span>
              <span className="rh-stat-lbl">Total Rides</span>
            </div>
          </div>
          <div className="rh-stat-pill">
            <span className="rh-stat-icon">💰</span>
            <div>
              <span className="rh-stat-num">₹{totalSpent.toFixed(0)}</span>
              <span className="rh-stat-lbl">Total Spent</span>
            </div>
          </div>
          <div className="rh-stat-pill">
            <span className="rh-stat-icon">⏱️</span>
            <div>
              <span className="rh-stat-num">{formatDuration(totalMinutes)}</span>
              <span className="rh-stat-lbl">Time Ridden</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rh-container">

        {/* Search + Filter */}
        <div className="rh-controls">
          <div className="rh-search-wrap">
            <span className="rh-search-icon">🔍</span>
            <input
              type="text"
              className="rh-search"
              placeholder="Search by cycle or station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rh-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`rh-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rh-loading">
            <div className="rh-spinner" />
            <p>Loading your rides...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredHistory.length === 0 && (
          <div className="rh-empty">
            <div className="rh-empty-icon">🚲</div>
            <h3>No rides found</h3>
            <p>
              {filter !== "All"
                ? `No ${filter.toLowerCase()} rides yet`
                : "Start your first ride today!"}
            </p>
            <button
              className="rh-empty-btn"
              onClick={() => navigate("/rentcycle")}
            >
              Rent a Cycle →
            </button>
          </div>
        )}

        {/* History Cards */}
        {!loading && filteredHistory.length > 0 && (
          <div className="rh-list">
            {filteredHistory.map((ride, idx) => {
              const statusCfg = getStatusConfig(ride.rentalStatus);
              const payCfg = getPaymentConfig(ride.paymentStatus);
              return (
                <div
                  className="rh-card"
                  key={ride.transactionId}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Card Left accent */}
                  <div
                    className="rh-card-accent"
                    style={{ background: statusCfg.dot }}
                  />

                  {/* Top row */}
                  <div className="rh-card-top">
                    <div className="rh-card-cycle">
                      <div className="rh-cycle-icon">🚲</div>
                      <div>
                        <h3 className="rh-cycle-name">{ride.cycleName || "—"}</h3>
                        <span className="rh-cycle-type">
                          {getCycleTypeName(ride.cycleType)}
                        </span>
                      </div>
                    </div>
                    <div className="rh-card-badges">
                      <span className={`rh-badge ${statusCfg.color}`}>
                        <span
                          className="rh-badge-dot"
                          style={{ background: statusCfg.dot }}
                        />
                        {statusCfg.label}
                      </span>
                      <span className={`rh-badge ${payCfg.color}`}>
                        {payCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="rh-card-route">
                    <div className="rh-route-point">
                      <span className="rh-route-dot pickup" />
                      <div>
                        <span className="rh-route-label">Pickup</span>
                        <span className="rh-route-name">{ride.pickupStation || "—"}</span>
                      </div>
                    </div>
                    <div className="rh-route-line">
                      <div className="rh-route-dashes" />
                      <span className="rh-route-bike">🚴</span>
                    </div>
                    <div className="rh-route-point">
                      <span className="rh-route-dot dropoff" />
                      <div>
                        <span className="rh-route-label">Return</span>
                        <span className="rh-route-name">{ride.returnStation || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="rh-card-details">
                    <div className="rh-detail">
                      <span className="rh-detail-icon">📅</span>
                      <div>
                        <span className="rh-detail-label">Date</span>
                        <span className="rh-detail-value">
                          {formatDate(ride.rentalStartTime)}
                        </span>
                      </div>
                    </div>
                    <div className="rh-detail">
                      <span className="rh-detail-icon">🕐</span>
                      <div>
                        <span className="rh-detail-label">Start Time</span>
                        <span className="rh-detail-value">
                          {formatTime(ride.rentalStartTime)}
                        </span>
                      </div>
                    </div>
                    <div className="rh-detail">
                      <span className="rh-detail-icon">⏱️</span>
                      <div>
                        <span className="rh-detail-label">Duration</span>
                        <span className="rh-detail-value">
                          {formatDuration(ride.rentalDuration)}
                        </span>
                      </div>
                    </div>
                    <div className="rh-detail highlight">
                      <span className="rh-detail-icon">💰</span>
                      <div>
                        <span className="rh-detail-label">Amount</span>
                        <span className="rh-detail-value amount">
                          ₹{ride.totalAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ride ID */}
                  <div className="rh-card-footer">
                    <span className="rh-ride-id">
                      Ride #{ride.transactionId}
                    </span>
                    <span className="rh-end-time">
                      {ride.rentalEndTime
                        ? `Ended ${formatTime(ride.rentalEndTime)}`
                        : "In Progress"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
         {/* ══════════ FOOTER ══════════ */}
      <footer className="ud-footer">
        <div className="ud-footer-inner">
          {/* Brand */}
          <div className="ud-footer-brand">
            <div className="ud-footer-logo">SpinCity 🚴</div>
            <p className="ud-footer-tagline">
              Ahmedabad's smartest way to move. Sustainable, affordable cycle
              rentals across the city.
            </p>
            <div className="ud-footer-socials">
              <a
                href="https://www.instagram.com/kirtida.prajapati"
                target="_blank"
                rel="noopener noreferrer"
                className="ud-footer-social"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/share/1CDsdiRmbZ/"
                target="_blank"
                rel="noopener noreferrer"
                className="ud-footer-social"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://wa.me/919429766948"
                target="_blank"
                rel="noopener noreferrer"
                className="ud-footer-social"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="ud-footer-col">
            <p className="ud-footer-col-title">Explore</p>
            <ul className="ud-footer-links">
              <li>
                <Link to="/rentcycle">Rent a Cycle</Link>
              </li>
              <li>
                <Link to="/userprofile">Membership Plans</Link>
              </li>
              <li>
                <Link to="/ridehistory">Ride History</Link>
              </li>
              <li>
                <Link to="/userprofile">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          {/* <div className="ud-footer-col">
            <p className="ud-footer-col-title">Company</p>
            <ul className="ud-footer-links">
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div> */}

          {/* Support — Reach Us → /contact */}
          <div className="ud-footer-col">
            <p className="ud-footer-col-title">Support</p>
            <ul className="ud-footer-links">
              <li>
                <Link to="/contact">Reach Us</Link>
              </li>
              <li>
                <Link to="/FAQ">FAQ</Link>
              </li>
              <li>
                <a href="https://www.google.com/maps/place/Shaligram+3+Bungalows,+Thaltej,+Ahmedabad,+Gujarat+380059/@23.0467778,72.5013693,17z/data=!3m1!4b1!4m6!3m5!1s0x395e9b5c684f905f:0x39c1401a9dbcdbd2!8m2!3d23.0467778!4d72.5013693!16s%2Fg%2F11h04mcv1?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D">
                  Station Map
                </a>
              </li>
              <li>
                <Link to="/safety">Safety Tips</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ud-footer-bottom">
          <p className="ud-footer-copy">
            © {new Date().getFullYear()} <span>SpinCity</span>. Built with ♥ in
            Ahmedabad.
          </p>
          <div className="ud-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RideHistory;