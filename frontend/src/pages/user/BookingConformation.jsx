import React, { useEffect, useState } from "react";
import "../../style/user/bookingconfirmation.css";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import userService from "../../service/userService";
import qr from "../../assets/qrcode/qr.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTodayStr = () => new Date().toISOString().split("T")[0];

const getNowTimeStr = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const addHours = (timeStr, h) => {
  const [hh, mm] = timeStr.split(":").map(Number);
  const total = hh * 60 + mm + h * 60;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
};

const addHoursOverflow = (timeStr, h) => {
  // returns { timeStr, extraDays }
  const [hh, mm] = timeStr.split(":").map(Number);
  const totalMin = hh * 60 + mm + h * 60;
  const extraDays = Math.floor(totalMin / 1440);
  const rem = totalMin % 1440;
  const newH = Math.floor(rem / 60);
  const newM = rem % 60;
  return {
    timeStr: `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`,
    extraDays,
  };
};

const addDaysToDate = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
// ──────────────────────────────────────────────────────────────────────────────

const BookingConfirmation = () => {
  const [rentalDuration, setRentalDuration] = useState("Daily");
  const [showPaymentQR, setShowPaymentQR]   = useState(false);
  const [rentalId, setRentalId]             = useState(null);
  const [returnDate, setReturnDate]         = useState("");
  const [returnTime, setReturnTime]         = useState("");
  const [paymentMethod, setPaymentMethod]   = useState("UPI");
  const [agreeTerms, setAgreeTerms]         = useState(false);
  const [agreeDeposit, setAgreeDeposit]     = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [returnStations, setReturnStations] = useState([]);
  const [selectedReturnStation, setSelectedReturnStation] = useState("");
  const [returnStationSelected, setReturnStationSelected] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [paymentDone, setPaymentDone]       = useState(false);
  const [timeRemaining, setTimeRemaining]   = useState(null);
  const [timerActive, setTimerActive]       = useState(false);
  const [dateError, setDateError]           = useState("");

  // Pickup is always TODAY, time is set on payment
  const pickupDate = getTodayStr();
  const [pickupTime, setPickupTime]         = useState(""); // set at payment

  const location = useLocation();
  const { selectedBike: passedBike, selectedStation } = location.state || {};

  // ── Persistent ride state ──────────────────────────────────────────────────
  // On mount, restore active ride from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("activeRide");
    if (saved) {
      try {
        const ride = JSON.parse(saved);
        // restore all state
        setPaymentDone(true);
        setRentalId(ride.rentalId);
        setSelectedReturnStation(String(ride.returnStationId));
        setReturnStationSelected(true);
        setRentalDuration(ride.rentalDuration || "Daily");

        // Calculate remaining seconds
        const endTs = ride.endTimestamp;
        const now   = Date.now();
        const remaining = Math.max(0, Math.floor((endTs - now) / 1000));
        setTimeRemaining(remaining);
        setTimerActive(remaining > 0);
      } catch (e) {
        localStorage.removeItem("activeRide");
      }
    }
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || timeRemaining === null) return;
    if (timeRemaining <= 0) { setTimerActive(false); return; }
    const interval = setInterval(() => setTimeRemaining((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    userService.getAllStations().then(setReturnStations).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        if (!customerId) return;
        const data = await userService.getCurrentMembership(customerId);
        setCurrentMembership(data);
      } catch (err) { console.error(err); }
    };
    fetchMembership();
  }, []);

  // ── Deposit ────────────────────────────────────────────────────────────────
  const getDepositAmount = (cycleType) => {
    const deposits = { 1: 1000, 2: 500, 3: 300, 4: 500, 5: 800, 6: 1500 };
    return deposits[cycleType] || 500;
  };

  // ── Category name ──────────────────────────────────────────────────────────
  const getCategoryName = (type) => {
    const c = { 1:"Gear", 2:"Non-Gear", 3:"Kids", 4:"Women", 5:"City", 6:"Electric" };
    return c[type] || "Cycle";
  };

  const selectedBike = passedBike ? {
    name:         passedBike.cycleName,
    type:         getCategoryName(passedBike.cycleType),
    image:        passedBike.imagePath
                    ? `http://localhost:8080${passedBike.imagePath}`
                    : "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400",
    hourlyPrice:  passedBike.pricePerHour,
    dailyPrice:   passedBike.dailyPrice,
    weeklyPrice:  passedBike.weeklyPrice,
    monthlyPrice: passedBike.monthlyPrice,
  } : null;

  // ── Return station ─────────────────────────────────────────────────────────
  const handleReturnStationChange = (e) => {
    const id = e.target.value;
    setSelectedReturnStation(id);
    setReturnStationSelected(!!id);
  };

  const getSelectedReturnStation = () =>
    returnStations.find((s) => s.stationId === parseInt(selectedReturnStation));

  // ── Validation: return date/time ───────────────────────────────────────────
  const validateReturnDateTime = (date, time, duration) => {
    if (!date || !time) return "";
    const today = getTodayStr();
    const now   = getNowTimeStr();

    // 1. No past dates
    if (date < today) return "⚠️ Please select a valid return date (not in the past).";

    if (duration === "Hourly") {
      // 4. Hourly: return must be same day, OR next day ONLY if current time is after 23:00
      const [nowH] = now.split(":").map(Number);
      const maxDate = nowH >= 23 ? addDaysToDate(today, 1) : today;
      if (date > maxDate)
        return "⚠️ For Hourly rental, return must be today (or tomorrow if it's past 11 PM).";

      // 5. Hourly: max 1 hour duration
      if (date === today) {
        const startMin = parseInt(now.split(":")[0]) * 60 + parseInt(now.split(":")[1]);
        const endMin   = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
        const diff     = endMin - startMin;
        if (diff <= 0) return "⚠️ Return time must be after current time.";
        if (diff > 60) return "⚠️ Hourly plan allows max 1 hour. For longer rides, choose Daily.";
      }
    }

    if (duration === "Daily") {
      // Daily: max 12 hours from now
      const startMs = new Date(`${today}T${now}`).getTime();
      const endMs   = new Date(`${date}T${time}`).getTime();
      const diffH   = (endMs - startMs) / 3600000;
      if (diffH <= 0) return "⚠️ Return time must be after current time.";
      if (diffH > 12) return "⚠️ Daily plan allows max 12 hours. For longer rides, choose Weekly.";
    }

    if (duration === "Weekly") {
      // 6. Weekly: must be at least next day, max 7 days
      if (date <= today) return "⚠️ Weekly rental must have a return date from tomorrow onwards.";
      const startMs = new Date(`${today}T${now}`).getTime();
      const endMs   = new Date(`${date}T${time}`).getTime();
      const diffD   = (endMs - startMs) / 86400000;
      if (diffD > 7) return "⚠️ Weekly plan allows max 7 days.";
    }

    return "";
  };

  const handleReturnDateChange = (e) => {
    const val = e.target.value;
    setReturnDate(val);
    setDateError(validateReturnDateTime(val, returnTime, rentalDuration));
  };

  const handleReturnTimeChange = (e) => {
    const val = e.target.value;
    setReturnTime(val);
    setDateError(validateReturnDateTime(returnDate, val, rentalDuration));
  };

  const handleDurationChange = (dur) => {
    setRentalDuration(dur);
    setReturnDate("");
    setReturnTime("");
    setDateError("");
  };

  // ── Min/max for return date input ──────────────────────────────────────────
  const getReturnDateMin = () => {
    if (rentalDuration === "Weekly") return addDaysToDate(getTodayStr(), 1);
    return getTodayStr();
  };

  const getReturnDateMax = () => {
    const today = getTodayStr();
    const now   = getNowTimeStr();
    if (rentalDuration === "Hourly") {
      const [nowH] = now.split(":").map(Number);
      return nowH >= 23 ? addDaysToDate(today, 1) : today;
    }
    if (rentalDuration === "Daily")  return today; // same day (max 12h handled in validation)
    if (rentalDuration === "Weekly") return addDaysToDate(today, 7);
    return addDaysToDate(today, 30);
  };

  // ── Calculate total ────────────────────────────────────────────────────────
  const calculateTotal = () => {
    if (!selectedBike) return 0;
    let basePrice = 0;
    if (rentalDuration === "Hourly")  basePrice = selectedBike.hourlyPrice  || 0;
    if (rentalDuration === "Daily")   basePrice = selectedBike.dailyPrice   || 0;
    if (rentalDuration === "Weekly")  basePrice = selectedBike.weeklyPrice  || 0;
    if (rentalDuration === "Monthly") basePrice = selectedBike.monthlyPrice || 0;

    let discount = 0, freeMinutes = 0;
    if (currentMembership && currentMembership.status === "ACTIVE") {
      if (currentMembership.planName === "WEEKLY")    { discount = 0.1; }
      if (currentMembership.planName === "MONTHLY")   { discount = 0.2; freeMinutes = 15; }
      if (currentMembership.planName === "QUARTERLY") { discount = 0.3; freeMinutes = 30; }
    }

    if (freeMinutes > 0 && returnDate && returnTime) {
      const now   = getNowTimeStr();
      const start = new Date(`${pickupDate}T${now}`);
      const end   = new Date(`${returnDate}T${returnTime}`);
      const mins  = Math.floor((end - start) / 60000);
      if (mins > 0 && mins <= freeMinutes) return 0;
    }

    const discounted = basePrice - basePrice * discount;
    return Math.max(isNaN(discounted) ? 0 : discounted, 0);
  };

  // ── Confirm booking ────────────────────────────────────────────────────────
  const handleConfirmBooking = () => {
    if (!returnDate || !returnTime) {
      alert("Please fill all rental details!");
      return;
    }
    const err = validateReturnDateTime(returnDate, returnTime, rentalDuration);
    if (err) { setDateError(err); return; }
    if (!agreeTerms)   { alert("Please agree to terms and conditions!"); return; }
    if (!agreeDeposit) {
      alert(`Please agree to pay the security deposit of ₹${getDepositAmount(passedBike?.cycleType)}!`);
      return;
    }
    setShowPaymentQR(true);
  };

  // ── Ride helpers ───────────────────────────────────────────────────────────
  const calculateRentalSeconds = () => {
    if (!returnDate || !returnTime) return 3600;
    const now   = getNowTimeStr();
    const start = new Date(`${pickupDate}T${now}`);
    const end   = new Date(`${returnDate}T${returnTime}`);
    const diff  = Math.floor((end - start) / 1000);
    return diff > 0 ? diff : 3600;
  };

  const formatTime = (secs) => {
    if (secs === null || secs < 0) return "00:00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const getRideProgress = () => {
    const total = calculateRentalSeconds();
    if (!total) return 0;
    const elapsed = total - (timeRemaining || 0);
    return Math.min((elapsed / total) * 100, 100);
  };

  const getStatusColor = () => {
    const pct = getRideProgress();
    if (pct < 60) return "green";
    if (pct < 85) return "orange";
    return "red";
  };

  // ── Distance ───────────────────────────────────────────────────────────────
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R   = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a   = Math.sin(dLat/2)**2 +
                Math.cos((lat1*Math.PI)/180) * Math.cos((lat2*Math.PI)/180) * Math.sin(dLon/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const getDistanceFromPickup = (station) => {
    if (!selectedStation?.latitude || !selectedStation?.longitude) return null;
    if (!station.latitude || !station.longitude) return null;
    return calculateDistance(
      selectedStation.latitude, selectedStation.longitude,
      station.latitude,         station.longitude,
    );
  };

  // ── Helper: hint text per duration ────────────────────────────────────────
  const getDurationHint = () => {
    if (rentalDuration === "Hourly")  return "Max 1 hour · Return today";
    if (rentalDuration === "Daily")   return "Max 12 hours · Return today";
    if (rentalDuration === "Weekly")  return "1–7 days · Return from tomorrow";
    return "";
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="booking-confirmation-page">
      <Navbar />

      <div className="booking-container">
        {/* ════ LEFT PANEL ════════════════════════════════════════════════════ */}
        <div className="booking-left">
          {!paymentDone ? (
            <>
              <h2 className="section-title">Rental Details</h2>

              {/* Duration */}
              <div className="duration-selector">
                {["Hourly","Daily","Weekly"].map((d) => (
                  <button
                    key={d}
                    className={`duration-btn ${rentalDuration === d ? "active" : ""}`}
                    onClick={() => handleDurationChange(d)}
                  >
                    {d === "Hourly" ? "⏱️" : "📅"} {d}
                  </button>
                ))}
              </div>

              {/* Duration hint */}
              {getDurationHint() && (
                <p style={{
                  fontSize: "12px", color: "#888", marginBottom: "12px",
                  background: "#f8f8f8", padding: "8px 14px", borderRadius: "8px",
                  borderLeft: "3px solid #667eea"
                }}>
                  ℹ️ {getDurationHint()}
                </p>
              )}

              {/* Return Station */}
              <div className="return-station-section">
                <div className="form-group">
                  <label>Return Station</label>
                  <select
                    className="form-control"
                    value={selectedReturnStation}
                    onChange={handleReturnStationChange}
                  >
                    <option value="">Select Return Station</option>
                    {returnStations
                      .map((s) => ({ ...s, distance: parseFloat(getDistanceFromPickup(s) || 999) }))
                      .sort((a, b) => a.distance - b.distance)
                      .map((s) => (
                        <option key={s.stationId} value={s.stationId}>
                          {s.stationName}
                          {s.distance !== 999
                            ? s.distance === 0 ? " — 📍 Your pickup station" : ` — ${s.distance} km away`
                            : ""}
                        </option>
                      ))}
                  </select>
                </div>

                {returnStationSelected && getSelectedReturnStation() && (
                  <div className="station-distance-card">
                    <span className="distance-icon">🗺️</span>
                    <div className="distance-info">
                      <strong>{getSelectedReturnStation().stationName}</strong>
                      <span>
                        {getDistanceFromPickup(getSelectedReturnStation()) !== null
                          ? `${getDistanceFromPickup(getSelectedReturnStation())} km from pickup`
                          : "Distance unavailable"}
                      </span>
                      <small>🚲 {getSelectedReturnStation().availableCycles} cycles available</small>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Pickup: always today, time shown as info ── */}
              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={pickupDate}
                    readOnly
                    style={{ background: "#f0f4ff", cursor: "not-allowed", fontWeight: 600 }}
                  />
                </div>
                <div className="form-group">
                  <label>Pickup Time</label>
                  <div className="form-control" style={{
                    background: "#f0f4ff", display:"flex", alignItems:"center",
                    gap:8, color:"#667eea", fontWeight:600, cursor:"not-allowed"
                  }}>
                    ⏰ Starts when you pay
                  </div>
                </div>
              </div>

              {/* ── Return Date & Time ── */}
              <div className="form-row">
                <div className="form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={returnDate}
                    min={getReturnDateMin()}
                    max={getReturnDateMax()}
                    onChange={handleReturnDateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Return Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={returnTime}
                    onChange={handleReturnTimeChange}
                  />
                </div>
              </div>

              {/* Date/time error */}
              {dateError && (
                <div style={{
                  background: "#fff0f0", border: "1px solid #ffcdd2",
                  borderRadius: "10px", padding: "10px 16px",
                  color: "#c0392b", fontSize: "13px", marginBottom: "16px",
                  display: "flex", alignItems: "center", gap: 8
                }}>
                  {dateError}
                </div>
              )}

              {/* Extras */}
              <h3 className="section-subtitle">Extras</h3>
              <div className="addons-grid">
                {["Safety Helmet","Front Basket","Phone Holder"].map((name) => (
                  <div className="addon-card" key={name}>
                    <div className="addon-name">{name}</div>
                    <div className="addon-price">Included (Free)</div>
                  </div>
                ))}
              </div>

              {/* Payment Method */}
              <h3 className="section-subtitle">Payment Method</h3>
              <div className="payment-methods">
                {[
                  { val: "UPI",    label: "💳 UPI" },
                  { val: "Card",   label: "💳 Credit/Debit Card" },
                  { val: "Wallet", label: "👛 Wallet" },
                  { val: "Cash",   label: "💵 Cash on Pickup" },
                ].map(({ val, label }) => (
                  <label key={val} className={`payment-option ${paymentMethod === val ? "active" : ""}`}>
                    <input type="radio" name="payment" value={val}
                      checked={paymentMethod === val}
                      onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {/* Terms */}
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)} />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <span className="modal-link" onClick={() => setShowTermsModal(true)}>
                    Terms &amp; Conditions
                  </span>{" "}
                  and{" "}
                  <span className="modal-link" onClick={() => setShowPolicyModal(true)}>
                    Rental Policy
                  </span>
                </label>
              </div>

              {/* Deposit */}
              <div className="terms-checkbox deposit-checkbox">
                <input type="checkbox" id="agreeDeposit" checked={agreeDeposit}
                  onChange={(e) => setAgreeDeposit(e.target.checked)} />
                <label htmlFor="agreeDeposit">
                  I agree to pay a security deposit of{" "}
                  <strong style={{ color: "#e63946" }}>
                    ₹{passedBike ? getDepositAmount(passedBike.cycleType) : 500}
                  </strong>{" "}
                  at the pickup station.{" "}
                  <span style={{ color: "#888", fontSize: "0.85rem" }}>(Refundable on return)</span>
                </label>
              </div>
            </>
          ) : (
            /* ════ ACTIVE RIDE PANEL ════════════════════════════════════════ */
            <div className="ride-status-panel">
              <div className="ride-status-header">
                <div className="ride-live-badge">
                  <span className="live-dot" />
                  LIVE RIDE
                </div>
                <h2 className="ride-status-title">You're on your way!</h2>
                <p className="ride-status-sub">Enjoy your ride. Stay safe, wear your helmet 🪖</p>
              </div>

              {/* Timer ring */}
              <div className="timer-container">
                <div className="timer-ring-wrap">
                  <svg className="timer-ring-svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="85" className="timer-ring-track" />
                    <circle cx="100" cy="100" r="85"
                      className={`timer-ring-progress ${getStatusColor()}`}
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      strokeDashoffset={`${2 * Math.PI * 85 * (1 - getRideProgress() / 100)}`}
                    />
                  </svg>
                  <div className="timer-inner">
                    <span className="timer-label">TIME LEFT</span>
                    <span className={`timer-digits ${getStatusColor()}`}>{formatTime(timeRemaining)}</span>
                    <span className="timer-sublabel">
                      {timeRemaining <= 0 ? "⚠️ Ride Over!" : timeRemaining < 600 ? "⚠️ Almost Done!" : "Ride Active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ride stats */}
              <div className="ride-stats-grid">
                {[
                  { icon:"📍", label:"Pickup",  val: selectedStation?.stationName || JSON.parse(localStorage.getItem("activeRide") || "{}")?.pickupStationName || "—" },
                  { icon:"🏁", label:"Return",  val: getSelectedReturnStation()?.stationName || JSON.parse(localStorage.getItem("activeRide") || "{}")?.returnStationName || "—" },
                  { icon:"🚲", label:"Cycle",   val: selectedBike?.name || JSON.parse(localStorage.getItem("activeRide") || "{}")?.cycleName || "—" },
                  { icon:"💰", label:"Paid",    val: `₹${(JSON.parse(localStorage.getItem("activeRide") || "{}")?.totalAmount || calculateTotal()).toFixed(2)}` },
                ].map(({ icon, label, val }) => (
                  <div className="ride-stat-card" key={label}>
                    <span className="stat-icon">{icon}</span>
                    <span className="stat-label">{label}</span>
                    <span className="stat-value">{val}</span>
                  </div>
                ))}
              </div>

              {/* Road animation */}
              <div className="road-animation">
                <div className="road-lines">
                  {[...Array(6)].map((_, i) => <div className="road-line" key={i} />)}
                </div>
                <div className="rider-wheel rider-wheel-back" />
                <div className="rider-wheel rider-wheel-front" />
                <div className="rider-body" />
              </div>

              <button
                className="end-ride-btn"
              >
                <Link to="/signup">🏁 Go to Dashboard to end your Ride!</Link>
                
                
              </button>

              {timeRemaining <= 600 && timeRemaining > 0 && (
                <div className="ride-warning-banner">
                  ⚠️ Less than 10 minutes remaining — please head to the return station!
                </div>
              )}
              {timeRemaining <= 0 && (
                <div className="ride-expired-banner">
                  🔴 Ride time ended. Please return your cycle immediately to avoid extra charges.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════ RIGHT PANEL — Booking Summary ═════════════════════════════════ */}
        <div className="booking-right">
          <div className="booking-summary">
            <h2 className="summary-title">Booking Summary</h2>

            {currentMembership && currentMembership.status === "ACTIVE" && currentMembership.planName !== "BASIC" && (
              <div className="membership-active-badge">
                <span className="badge-icon">⭐</span>
                <div className="badge-content">
                  <strong>{currentMembership.planName} Member</strong>
                  <p>
                    {currentMembership.planName === "WEEKLY"    && "10% discount on all rides"}
                    {currentMembership.planName === "MONTHLY"   && "20% off + First 15 min FREE"}
                    {currentMembership.planName === "QUARTERLY" && "30% off + First 30 min FREE"}
                  </p>
                </div>
              </div>
            )}

            {selectedBike ? (
              <div className="selected-bike">
                <img src={selectedBike.image} alt={selectedBike.name} />
                <div className="bike-info">
                  <h3>{selectedBike.name}</h3>
                  <p className="bike-type">{selectedBike.type}</p>
                </div>
              </div>
            ) : (
              <div className="selected-bike">
                <p style={{ textAlign:"center", color:"#999" }}>No bike selected</p>
              </div>
            )}

            <div className="summary-details">
              {selectedStation && (
                <div className="summary-row">
                  <span>Pickup Station</span>
                  <strong>{selectedStation.stationName}</strong>
                </div>
              )}
              <div className="summary-row">
                <span>Rental Duration</span>
                <strong>{rentalDuration}</strong>
              </div>
              <div className="summary-row">
                <span>Bike Rental</span>
                <strong>
                  ₹{rentalDuration === "Hourly"  ? selectedBike?.hourlyPrice
                    : rentalDuration === "Daily"  ? selectedBike?.dailyPrice
                    : rentalDuration === "Weekly" ? selectedBike?.weeklyPrice
                    : selectedBike?.monthlyPrice}
                </strong>
              </div>

              {currentMembership && currentMembership.status === "ACTIVE" && currentMembership.planName !== "BASIC" && (
                <div className="summary-row discount-row">
                  <span>
                    🎉 {currentMembership.planName} Discount (
                    {currentMembership.planName === "WEEKLY" ? "10"
                      : currentMembership.planName === "MONTHLY" ? "20"
                      : currentMembership.planName === "QUARTERLY" ? "30" : "0"}%)
                  </span>
                  <strong className="discount-amount">
                    - ₹{(() => {
                      const base = rentalDuration === "Hourly"  ? selectedBike?.hourlyPrice
                                 : rentalDuration === "Daily"   ? selectedBike?.dailyPrice
                                 : rentalDuration === "Weekly"  ? selectedBike?.weeklyPrice
                                 : selectedBike?.monthlyPrice;
                      const disc = currentMembership.planName === "WEEKLY" ? 0.1
                                 : currentMembership.planName === "MONTHLY" ? 0.2
                                 : currentMembership.planName === "QUARTERLY" ? 0.3 : 0;
                      return (base * disc).toFixed(2);
                    })()}
                  </strong>
                </div>
              )}

              {currentMembership && (currentMembership.planName === "MONTHLY" || currentMembership.planName === "QUARTERLY") && (
                <div className="free-minutes-banner">
                  <span className="free-icon">⏱️</span>
                  <span className="free-text">
                    First {currentMembership.planName === "MONTHLY" ? "15" : "30"} minutes FREE!
                  </span>
                </div>
              )}
            </div>

            {passedBike && (
              <div className="deposit-info-card">
                <div className="deposit-row">
                  <span>🔒 Security Deposit</span>
                  <span className="deposit-amount">₹{getDepositAmount(passedBike.cycleType)}</span>
                </div>
                <p className="deposit-note">Collected at pickup station • Fully refundable on return</p>
              </div>
            )}

            <div className="total-amount">
              <span>Total Amount</span>
              <strong className="amount">₹{calculateTotal().toFixed(2)}</strong>
            </div>

            <button className="confirm-btn" onClick={handleConfirmBooking}>
              Pay →
            </button>

            <div className="benefits">
              {[["🔒","Secure Payment"],["✓","Best Price"],["🛡️","Insured"]].map(([icon, label]) => (
                <div className="benefit-item" key={label}>
                  <span className="icon">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════ TERMS MODAL ═══════════════════════════════════════════════════ */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📜 Terms &amp; Conditions</h2>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <h3>1. Rental Agreement</h3>
              <p>By renting a cycle from SPIN City, you agree to use the cycle responsibly and return it in the same condition.</p>
              <h3>2. Age Requirement</h3>
              <p>Renters must be at least 18 years old with a valid ID proof.</p>
              <h3>3. Payment Terms</h3>
              <p>Full payment must be made at the time of booking. Refunds are subject to our cancellation policy.</p>
              <h3>4. Damage &amp; Loss</h3>
              <p>You are responsible for any damage or loss to the cycle during the rental period.</p>
              <h3>5. Safety Rules</h3>
              <p>• Always wear a helmet<br/>• Follow traffic rules<br/>• Do not ride under the influence<br/>• Lock the cycle when parked</p>
              <h3>6. Late Returns</h3>
              <p>Late returns will incur additional charges of ₹50 per hour.</p>
            </div>
          </div>
        </div>
      )}

      {/* ════ POLICY MODAL ══════════════════════════════════════════════════ */}
      {showPolicyModal && (
        <div className="modal-overlay" onClick={() => setShowPolicyModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚲 Rental Policy</h2>
              <button className="modal-close" onClick={() => setShowPolicyModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <h3>Pickup &amp; Return</h3>
              <p>• Cycles must be picked up and returned at the selected station<br/>• Bring valid ID proof<br/>• Inspect the cycle before taking it</p>
              <h3>Cancellation Policy</h3>
              <p>• Free cancellation up to 2 hours before pickup<br/>• 50% refund within 2 hours<br/>• No refund for no-shows</p>
              <h3>Usage Guidelines</h3>
              <p>• Cycles are for personal use within city limits only<br/>• Maximum weight capacity: 100kg<br/>• Not allowed on highways</p>
              <h3>Maintenance Issues</h3>
              <p>Contact support: <strong>+91-94297-66948</strong></p>
              <h3>Security Deposit</h3>
              <p>A refundable security deposit is charged and returned within 24 hours after cycle return.</p>
            </div>
          </div>
        </div>
      )}

      {/* ════ PAYMENT QR MODAL ══════════════════════════════════════════════ */}
      {showPaymentQR && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            {/* Wind streaks & particles */}
            <div className="wind-streaks">
              {[...Array(5)].map((_, i) => <div className="streak" key={i} />)}
            </div>
            {[...Array(8)].map((_, i) => <div className="particle" key={i} />)}
            <div className="speed-corner"><span /><span /><span /></div>

            {/* ── Back button ── */}
            <button
              onClick={() => setShowPaymentQR(false)}
              style={{
                position:"absolute", top:16, left:16,
                background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
                borderRadius:"50%", width:36, height:36, cursor:"pointer",
                color:"white", fontSize:18, display:"flex", alignItems:"center",
                justifyContent:"center", backdropFilter:"blur(8px)", zIndex:10,
                transition:"background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseOut={(e)  => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              title="Go back"
            >
              ‹
            </button>

            <h3>Scan to Pay via Google Pay</h3>
            <span className="scan-hint">⚡ Scan &amp; Ride Instantly ⚡</span>

            <div className="payment-qr-wrapper">
              <img src={qr} alt="GPay QR Code" className="payment-qr-image" />
            </div>

            <p>Total Amount: ₹{calculateTotal()}</p>

            {/* ── I've Paid → Start Ride ── */}
            <button
              className="close-payment-btn"
              onClick={async () => {
                try {
                  const customerId      = parseInt(localStorage.getItem("customerId"));
                  const cycleId         = parseInt(passedBike?.cycleId);
                  const pickupStationId = parseInt(selectedStation?.stationId);
                  const returnStationId = parseInt(selectedReturnStation);

                  if (!cycleId || !pickupStationId || !returnStationId || !customerId) {
                    alert(`Missing data! cycleId:${cycleId} pickup:${pickupStationId} return:${returnStationId} customer:${customerId}`);
                    return;
                  }

                  // Pickup time = NOW
                  const nowStr  = getNowTimeStr();
                  const nowFull = `${pickupDate}T${nowStr}:00`;
                  const endFull = `${returnDate}T${returnTime}:00`;

                  const returnDT = new Date(endFull);
                  const pickupDT = new Date(nowFull);
                  if (returnDT <= pickupDT) {
                    alert("❌ Return time must be after current time!");
                    return;
                  }

                  const rental = await userService.startRental(
                    customerId, cycleId, pickupStationId, returnStationId,
                    endFull, calculateTotal(),
                  );

                  const totalSecs = calculateRentalSeconds();

                  // ── Save to localStorage for persistence ──
                  localStorage.setItem("activeRide", JSON.stringify({
                    rentalId:          rental.rentalId,
                    returnStationId,
                    returnStationName: getSelectedReturnStation()?.stationName || "",
                    pickupStationName: selectedStation?.stationName || "",
                    cycleName:         selectedBike?.name || "",
                    rentalDuration,
                    totalAmount:       calculateTotal(),
                    endTimestamp:      Date.now() + totalSecs * 1000,
                  }));

                  setPickupTime(nowStr);
                  setRentalId(rental.rentalId);
                  setShowPaymentQR(false);
                  setPaymentDone(true);
                  setTimeRemaining(totalSecs);
                  setTimerActive(true);
                } catch (err) {
                  console.error("Failed to start rental:", err);
                  alert("Could not start rental. Please try again.");
                }
              }}
            >
              I've Paid — Start Ride 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;