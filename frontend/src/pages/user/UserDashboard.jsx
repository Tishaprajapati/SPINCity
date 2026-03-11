import React, { useState, useEffect, useRef } from "react";
import "../../style/user/userdash.css";
import userService from "../../service/userService.js";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/yourHeroImage.png";

// ── Both uploaded images ──
import aboutImg1 from "../../assets/images/cyclists.png"; // 1772px wide — group at riverfront
import aboutImg2 from "../../assets/images/bridge.png"; // 2048×1592 — couple at Atal Bridge

const CATEGORIES = [
  { id: "1", name: "Gear Cycle", abbr: "Gear", color: "#2d5a3d" },
  { id: "2", name: "Non-Gear", abbr: "Non-Gear", color: "#4a7c8e" },
  { id: "3", name: "Kids Cycle", abbr: "Kids", color: "#c9a84c" },
  { id: "4", name: "Women", abbr: "Women", color: "#8e5a7c" },
  { id: "5", name: "City Cycle", abbr: "City", color: "#5a6e8e" },
  { id: "6", name: "Electric", abbr: "Electric", color: "#2d7a5a" },
];

const getCategoryImage = (cycleType) => {
  const images = {
    1: "/uploads/cycles/gear.png",
    2: "/uploads/cycles/nongear.png",
    3: "/uploads/cycles/kids.png",
    4: "/uploads/cycles/woman.png",
    5: "/uploads/cycles/city.png",
    6: "/uploads/cycles/electric.jpg",
  };
  return `http://localhost:8080${images[String(cycleType)] || "/uploads/cycles/gear.jpg"}`;
};

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);
  const [membership, setMembership] = useState(null);
  const [recentRides, setRecentRides] = useState([]);

  // End ride states
  const [showEndRideModal, setShowEndRideModal] = useState(false);
  const [selectedEndStation, setSelectedEndStation] = useState("");
  const [showDepositCard, setShowDepositCard] = useState(false);
  const [depositAcknowledged, setDepositAcknowledged] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Cycle browse states
  const [browseStations, setBrowseStations] = useState([]);
  const [selectedBrowseStation, setSelectedBrowseStation] = useState(null);
  const [availableCycles, setAvailableCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(false);
  const [activeCatFilter, setActiveCatFilter] = useState(null);

  const cycleScrollRef = useRef(null);
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const ridesSectionRef = useRef(null);

  /* ── Data fetching ── */
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const data = await userService.getCurrentMembership(customerId);
        if (data && data.status === "ACTIVE") setMembership(data);
      } catch (_) {}
    };
    if (customerId) fetchMembership();
  }, [customerId]);

  // ✅ Poll for ride completion after user ends ride
  useEffect(() => {
    let pollInterval = null;

    // In the polling useEffect — update the deposit modal message based on status
    const checkRideCompletion = async () => {
      const data = await userService.getDashboard(customerId);
      if (!data.activeRental) {
        clearInterval(pollInterval);
        setDashboardData(data);
        localStorage.removeItem("activeRide");
        localStorage.removeItem("cashPendingRide");
        setShowDepositCard(false);
        setShowRatingModal(true);
      }
    };

    // Only start polling if deposit card is showing
    if (showDepositCard) {
      pollInterval = setInterval(checkRideCompletion, 5000); // every 5 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [showDepositCard]); // ← runs when deposit card appears

  useEffect(() => {
    const fetchShowcaseCycles = async () => {
      try {
        setLoadingCycles(true);

        // Fetch stations + full cycle details (with prices) in parallel
        const [allStations, allCyclesWithPrices] = await Promise.all([
          userService.getAllStations(),
          userService.getAllAvailableCycles(), // this has pricePerHour, dailyPrice, imagePath etc.
        ]);

        setStations(allStations);
        setBrowseStations(allStations);

        // Build stationId → full station object map for booking navigation
        const stationById = {};
        allStations.forEach((s) => {
          stationById[s.stationId] = s;
        });
        // Build a map: cycleId → full cycle details (prices, images, etc.)
        const priceMap = {};
        allCyclesWithPrices.forEach((c) => {
          priceMap[c.cycleId] = c;
        });

        const rotatingTypes = [
          "1",
          "4",
          "5",
          "6",
          "2",
          "3",
          "5",
          "1",
          "4",
          "6",
          "2",
          "5",
          "1",
          "4",
        ];

        const showcase = [];

        await Promise.all(
          allStations.map(async (station, index) => {
            try {
              const stationCycles = await userService.getStationCycles(
                station.stationId,
              );
              const available = stationCycles.filter(
                (c) => c.currentStatus === "Available",
              );

              if (available.length === 0) return;

              const preferredType = rotatingTypes[index % rotatingTypes.length];

              // Pick preferred type first, fallback to any available
              const picked =
                available.find((c) => String(c.cycleType) === preferredType) ||
                available[0];

              // Merge with full details from getAllAvailableCycles (prices, images, points)
              const fullDetails = priceMap[picked.cycleId] || {};

              showcase.push({
                ...fullDetails, // has pricePerHour, dailyPrice, imagePath, point1, point2, point3
                ...picked, // overwrite with station-specific fields (currentStatus etc.)
                stationName: station.stationName,
                stationId: station.stationId, // ← add this
                _station: station,
                _slotIndex: index,
              });
            } catch (_) {}
          }),
        );

        showcase.sort((a, b) => a._slotIndex - b._slotIndex);
        setAvailableCycles(showcase);
      } catch (_) {
        setAvailableCycles([]);
      } finally {
        setLoadingCycles(false);
      }
    };

    fetchShowcaseCycles();
  }, []);

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const data = await userService.getRentalHistory(customerId);
        setRecentRides(
          (data || [])
            .filter((r) => r.rentalStatus === "Completed")
            .slice(0, 3),
        );
      } catch (_) {}
    };
    if (customerId) fetchRecentRides();
  }, [customerId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (customerId) fetchDashboardData();
  }, [customerId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        ridesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
      const data = await userService.getDashboard(customerId);
      setDashboardData(data);
      setError(null);
    } catch (_) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadCyclesForStation = async (station) => {
    setSelectedBrowseStation(station);
    setActiveCatFilter(null);
    try {
      setLoadingCycles(true);
      const [stationData, allData] = await Promise.all([
        userService.getStationCycles(station.stationId),
        userService.getAllAvailableCycles(),
      ]);
      const availIds = stationData
        .filter((c) => c.currentStatus === "Available")
        .map((c) => c.cycleId);
      setAvailableCycles(allData.filter((b) => availIds.includes(b.cycleId)));
    } catch (_) {
      setAvailableCycles([]);
    } finally {
      setLoadingCycles(false);
    }
  };

  /* ── Helpers ── */
  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";
  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";
  const getCatInfo = (t) =>
    CATEGORIES.find((c) => c.id === String(t)) || {
      color: "#2d5a3d",
      abbr: "Cycle",
    };

  const displayedCycles = availableCycles;

  const scrollCycles = (dir) =>
    cycleScrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    setSubmittingFeedback(true);
    try {
      await userService.submitFeedback({
        customerId: parseInt(customerId),
        rating,
        comments: feedbackNote || null,
      });
      alert("Thank you for your feedback!");
      setShowRatingModal(false);
      setRating(0);
      setFeedbackNote("");
    } catch (_) {
      alert("Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  /* ── Guards ── */
  if (loading)
    return (
      <div className="ud-loading">
        <div className="ud-spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  if (error || !dashboardData)
    return (
      <div className="ud-loading">
        <p>{error || "Failed to load"}</p>
      </div>
    );

  const user = {
    name: dashboardData.name,
    email: dashboardData.email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(dashboardData.name)}&background=2d5a3d&color=ffffff&size=128`,
    memberSince: dashboardData.memberSince,
    membershipType: membership?.planName || "BASIC",
    membershipExpiry: membership?.endDate || null,
  };

  const activeRental = dashboardData.activeRental
    ? { isActive: true, ...dashboardData.activeRental }
    : { isActive: false };

  const totalRides = dashboardData.totalRides || 0;
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  };

  return (
    <div className="ud-root">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="ud-hero">
        <img src={heroImage} alt="SpinCity Ahmedabad" className="ud-hero-bg" />
        <div className="ud-hero-overlay" />

        {/* Floating glass stat pills */}
        <div className="ud-hero-stats">
          <div className="ud-hero-stat-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 000-2v2zm-9.5 5.5L7 7l4 4.5m4-5.5l2 5.5M7 7l2-1h4l3 5.5" />
            </svg>
            <span className="ud-hsp-val">{totalRides}</span>
            <span className="ud-hsp-lbl">Rides</span>
          </div>
          <div className="ud-hero-stat-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="ud-hsp-val">{browseStations.length}</span>
            <span className="ud-hsp-lbl">Stations</span>
          </div>
        </div>

        <div className="ud-hero-content">
          <p className="ud-greeting">{getGreeting()}</p>
          <h1 className="ud-hero-name">{user.name}</h1>
          <div className="ud-hero-meta">
            <span className="ud-badge">{user.membershipType} Member</span>
            <span className="ud-hero-time">
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ ACTIVE RIDE BANNER ══════════ */}
      {activeRental.isActive && (
        <div className="ud-active-banner">
          <div className="ud-active-banner-inner">
            <div className="ud-ab-left">
              <span className="ud-pulse-dot" />
              <div>
                <p className="ud-ab-title">Active — {activeRental.cycleName}</p>
                <p className="ud-ab-sub">
                  {activeRental.station} · {activeRental.duration}
                </p>
              </div>
            </div>
            <div className="ud-ab-right">
              <span className="ud-ab-charges">
                ₹{activeRental.currentCharges}
              </span>
              <button
                className="ud-btn ud-btn-danger ud-btn-sm"
                onClick={() => setShowEndRideModal(true)}
              >
                End Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="ud-container">
        {/* ── TOP ROW ── */}
        <div className="ud-top-row">
          {/* Profile Card */}
          <div className="ud-card ud-profile-card">
            <div className="ud-avatar-wrap">
              <img src={user.avatar} alt={user.name} className="ud-avatar" />
            </div>
            <h3 className="ud-profile-name">{user.name}</h3>
            <p className="ud-profile-email">{user.email}</p>
            <div className="ud-profile-meta">
              <div className="ud-pm-item">
                <span className="ud-pm-val">{totalRides}</span>
                <span className="ud-pm-lbl">Rides</span>
              </div>
              <div className="ud-pm-div" />
              <div className="ud-pm-item">
                <span className="ud-pm-val">{user.membershipType}</span>
                <span className="ud-pm-lbl">Plan</span>
              </div>
              <div className="ud-pm-div" />
              <div className="ud-pm-item">
                <span className="ud-pm-val">
                  {String(user.memberSince || "").slice(0, 4) || "—"}
                </span>
                <span className="ud-pm-lbl">Since</span>
              </div>
            </div>
            {user.membershipExpiry && (
              <p className="ud-profile-expiry">
                Plan expires{" "}
                {new Date(user.membershipExpiry).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            <Link
              to="/userprofile"
              className="ud-btn ud-btn-outline ud-btn-full"
            >
              View Profile
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="ud-card ud-actions-card">
            <h3 className="ud-card-title">Quick Actions</h3>
            <div className="ud-actions-grid">
              {[
                {
                  to: "/rentcycle",
                  label: "Rent Cycle",
                  grad: "linear-gradient(135deg,#2d5a3d,#4a8a5d)",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <path d="M15 6a1 1 0 000-2v2zm-9.5 5.5L7 7l4 4.5m4-5.5l2 5.5M7 7l2-1h4l3 5.5" />
                    </svg>
                  ),
                },
                {
                  to: "/ridehistory",
                  label: "History",
                  grad: "linear-gradient(135deg,#c9a84c,#e0bb6e)",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  to: "/contact",
                  label: "Reach us",
                  grad: "linear-gradient(135deg,#4a7c8e,#6aaabb)",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  ),
                },
                {
                  to: "/userprofile",
                  label: "Profile",
                  grad: "linear-gradient(135deg,#8e5a7c,#b07aa0)",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ),
                },
              ].map((a, i) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="ud-action-tile"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="ud-at-icon" style={{ background: a.grad }}>
                    {a.icon}
                  </div>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Rides */}
          <div className="ud-card ud-recent-card">
            <div className="ud-card-head">
              <h3 className="ud-card-title">Recent Rides</h3>
              <Link to="/ridehistory" className="ud-view-all">
                View all →
              </Link>
            </div>
            {recentRides.length === 0 ? (
              <div className="ud-empty-sm">
                <p>No rides yet</p>
                <Link
                  to="/user/rent"
                  className="ud-btn ud-btn-primary ud-btn-sm"
                >
                  Rent Now
                </Link>
              </div>
            ) : (
              <div className="ud-rides-list">
                {recentRides.map((ride, idx) => (
                  <div
                    className="ud-ride-item"
                    key={ride.rentalId || idx}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="ud-ride-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="5.5" cy="17.5" r="3.5" />
                        <circle cx="18.5" cy="17.5" r="3.5" />
                        <path d="M15 6a1 1 0 000-2v2zm-9.5 5.5L7 7l4 4.5m4-5.5l2 5.5M7 7l2-1h4l3 5.5" />
                      </svg>
                    </div>
                    <div className="ud-ride-details">
                      <p className="ud-ride-name">
                        {ride.cycleName || "Cycle Ride"}
                      </p>
                      <p className="ud-ride-route">
                        {ride.pickupStation || "—"} →{" "}
                        {ride.returnStation || "—"}
                      </p>
                      <p className="ud-ride-time">
                        {formatDate(ride.startTime)} ·{" "}
                        {formatTime(ride.startTime)}
                      </p>
                    </div>
                    <div className="ud-ride-right">
                      <p className="ud-ride-amount">₹{ride.totalAmount || 0}</p>
                      <span className="ud-ride-status completed">Done</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ CHOOSE YOUR RIDE ══════════ */}
        <section className="ud-ride-section" ref={ridesSectionRef}>
          <div className="ud-ride-header">
            <div>
              <h2 className="ud-section-title">Choose Your Ride</h2>
              <p className="ud-section-sub">
                Featured cycles from stations across Ahmedabad
              </p>
            </div>
            <Link to="/rentcycle" className="ud-btn ud-btn-outline">
              Explore All →
            </Link>
          </div>

          {/* Carousel */}
          <div className="ud-carousel-outer">
            {displayedCycles.length > 3 && (
              <button
                className="ud-carr-btn ud-carr-left"
                onClick={() => scrollCycles(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {loadingCycles ? (
              <div className="ud-cycles-row">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="ud-cycle-skeleton"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            ) : displayedCycles.length === 0 ? (
              <div className="ud-cycles-empty">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 000-2v2zm-9.5 5.5L7 7l4 4.5m4-5.5l2 5.5M7 7l2-1h4l3 5.5" />
                </svg>
                <p>
                  {selectedBrowseStation
                    ? "No cycles available here"
                    : "Select a station above"}
                </p>
              </div>
            ) : (
              <div className="ud-cycles-row" ref={cycleScrollRef}>
                {displayedCycles.map((bike, idx) => {
                  const cat = getCatInfo(bike.cycleType);
                  return (
                    <div
                      key={bike.cycleId}
                      className="ud-cycle-card"
                      style={{
                        "--cc": cat.color,
                        animationDelay: `${idx * 0.06}s`,
                      }}
                      onClick={() =>
                        navigate("/bookingconfirmation", {
                          state: {
                            selectedBike: bike,
                            selectedStation: bike._station,
                          },
                        })
                      }
                    >
                      <div className="ud-cc-shimmer" />
                      <div className="ud-cc-img-wrap">
                        <img
                          src={
                            bike.imagePath
                              ? `http://localhost:8080${bike.imagePath}`
                              : getCategoryImage(bike.cycleType)
                          }
                          alt={bike.cycleName}
                          className="ud-cc-img"
                        />
                        <span
                          className="ud-cc-tag"
                          style={{ background: cat.color }}
                        >
                          {cat.abbr}
                        </span>
                        <div className="ud-cc-available-badge">Available</div>
                      </div>
                      <div className="ud-cc-body">
                        {bike.stationName && (
                          <p className="ud-cc-station">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              width="11"
                              height="11"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {bike.stationName}
                          </p>
                        )}
                        <h4 className="ud-cc-name">{bike.cycleName}</h4>
                        <p className="ud-cc-brand">
                          {bike.cycleBrand} · {bike.cycleModel}
                        </p>

                        {bike.point1 && (
                          <div className="ud-cc-features">
                            {[bike.point1, bike.point2, bike.point3]
                              .filter(Boolean)
                              .map((p, i) => (
                                <span key={i} className="ud-cc-feat">
                                  {p}
                                </span>
                              ))}
                          </div>
                        )}
                        <div className="ud-cc-prices">
                          <div className="ud-cc-price">
                            <span className="ud-cc-pval">
                              ₹{bike.pricePerHour}
                            </span>
                            <span className="ud-cc-plbl">/hr</span>
                          </div>
                          <div className="ud-cc-pdiv" />
                          <div className="ud-cc-price">
                            <span className="ud-cc-pval">
                              ₹{bike.dailyPrice}
                            </span>
                            <span className="ud-cc-plbl">/day</span>
                          </div>
                        </div>
                        <div className="ud-cc-rent-btn">
                          Rent Now
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {displayedCycles.length > 3 && (
              <button
                className="ud-carr-btn ud-carr-right"
                onClick={() => scrollCycles(1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ══════════ ABOUT US SECTION ══════════ */}
      <section className="ud-about-section">
        <div className="ud-about-inner">
          {/* Images side */}
          <div className="ud-about-images">
            {/* cyclists.png — 1772px wide group photo — main large top image */}
            <img
              src={aboutImg1}
              alt="SpinCity riders at Sabarmati Riverfront"
              className="ud-about-img-main"
            />
            {/* bridge.png — 2048×1592 couple at Atal Bridge — overlapping sub image */}
            <img
              src={aboutImg2}
              alt="Couple cycling near Atal Bridge Ahmedabad"
              className="ud-about-img-sub"
            />
          </div>

          {/* Text side */}
          <div className="ud-about-text">
            <p className="ud-about-eyebrow">About SpinCity</p>
            <h2 className="ud-about-title">
              Ahmedabad rides
              <br />
              better on two wheels
            </h2>
            <p className="ud-about-desc">
              Born on the banks of the Sabarmati, SpinCity is Ahmedabad's
              premier smart cycle rental service. From the colourful Atal Bridge
              to the sweeping Riverfront promenade — we put the perfect cycle in
              your hands so you can explore the city your way, at your pace.
            </p>

            <div className="ud-about-stats">
              <div className="ud-about-stat">
                <span className="ud-about-stat-val">
                  {browseStations.length}+
                </span>
                <span className="ud-about-stat-lbl">Docking Stations</span>
              </div>
              <div className="ud-about-stat">
                <span className="ud-about-stat-val">
                  {totalRides || "500"}+
                </span>
                <span className="ud-about-stat-lbl">Happy Rides</span>
              </div>
              <div className="ud-about-stat">
                <span className="ud-about-stat-val">
                  {dashboardData.carbonSaved || "200"}kg
                </span>
                <span className="ud-about-stat-lbl">CO₂ Saved</span>
              </div>
            </div>

            <div className="ud-about-actions">
              <Link to="/user/rent" className="ud-btn ud-btn-primary">
                Start Riding
              </Link>
              {/* Reach Us → redirects to /contact */}
              <Link to="/contact" className="ud-btn ud-btn-outline">
                Reach Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              <a href="#" className="ud-footer-social" aria-label="Instagram">
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
              <a href="#" className="ud-footer-social" aria-label="Twitter">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 4l16 16M4 20L20 4" />
                </svg>
              </a>
              <a href="#" className="ud-footer-social" aria-label="Facebook">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="ud-footer-social" aria-label="WhatsApp">
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
                <Link to="/user/rent">Rent a Cycle</Link>
              </li>
              <li>
                <Link to="/user/plans">Membership Plans</Link>
              </li>
              <li>
                <Link to="/user/history">Ride History</Link>
              </li>
              <li>
                <Link to="/user/profile">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="ud-footer-col">
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
          </div>

          {/* Support — Reach Us → /contact */}
          <div className="ud-footer-col">
            <p className="ud-footer-col-title">Support</p>
            <ul className="ud-footer-links">
              <li>
                <Link to="/contact">Reach Us</Link>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Station Map</a>
              </li>
              <li>
                <a href="#">Safety Tips</a>
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

      {/* ══ MODALS ══ */}

      {/* End Ride Modal */}
      {showEndRideModal && (
        <div
          className="ud-modal-overlay"
          onClick={() => setShowEndRideModal(false)}
        >
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <h3>End Your Ride</h3>
            <p>Select the station where you are returning the cycle.</p>
            <select
              className="ud-select"
              value={selectedEndStation}
              onChange={(e) => setSelectedEndStation(e.target.value)}
            >
              <option value="">-- Select Return Station --</option>
              {stations.map((s) => (
                <option key={s.stationId} value={s.stationId}>
                  {s.stationName}
                </option>
              ))}
            </select>
            <div className="ud-modal-btns">
              <button
                className="ud-btn ud-btn-ghost"
                onClick={() => setShowEndRideModal(false)}
              >
                Cancel
              </button>
              <button
                className="ud-btn ud-btn-danger"
                onClick={async () => {
                  if (!selectedEndStation) {
                    alert("Please select a return station!");
                    return;
                  }
                  try {
                    await userService.endRental(
                      activeRental.rentalId,
                      parseInt(selectedEndStation),
                    );
                    localStorage.removeItem("activeRide"); // ✅ ADD
                    localStorage.removeItem("cashPendingRide");
                    setShowEndRideModal(false);
                    setShowDepositCard(true); // ✅ starts the polling via useEffect above
                    fetchDashboardData();
                    setShowDepositCard(true);
                    fetchDashboardData();
                  } catch (err) {
                    console.error("End ride error:", err);
                    // ✅ Still show deposit card even if backend has minor issue
                    setShowEndRideModal(false);
                    setShowDepositCard(true);
                    fetchDashboardData();
                  }
                }}
              >
                Confirm End Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositCard && (
        <div className="ud-modal-overlay">
          <div className="ud-modal ud-deposit-modal">
            <div className="ud-deposit-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>End Ride Request Sent!</h3>
            <p>
              The station employee will verify the cycle and complete your ride.
            </p>
            <div className="ud-deposit-box">
              <span>Security Deposit</span>
              <strong>Employee will return it after cycle check ✅</strong>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div
          className="ud-modal-overlay"
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className="ud-modal ud-rating-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Rate Your Ride</h3>
            <p>Your feedback helps us improve the experience.</p>
            <div className="ud-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`ud-star ${star <= (hoveredRating || rating) ? "active" : ""}`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="ud-rating-label">{ratingLabels[rating]}</p>
            )}
            <div className="ud-feedback-field">
              <label>Tell us more (optional)</label>
              <textarea
                className="ud-textarea"
                placeholder="What did you enjoy? What could be better?"
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <span className="ud-char-count">{feedbackNote.length}/500</span>
            </div>
            <div className="ud-modal-btns">
              <button
                className="ud-btn ud-btn-ghost"
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setFeedbackNote("");
                }}
              >
                Skip
              </button>
              <button
                className="ud-btn ud-btn-primary"
                disabled={rating === 0 || submittingFeedback}
                onClick={handleSubmitFeedback}
              >
                {submittingFeedback ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
