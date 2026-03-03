import React, { useEffect, useState, useRef } from "react";
import userService from "../../service/userService";
import "../../style/user/ridestatusbar.css";

const RideStatusBar = () => {
  const [activeRental, setActiveRental] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const barRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 200,
  });

  // ── Parse "0h 46m" → seconds ──
  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const hMatch = durationStr.match(/(\d+)h/);
    const mMatch = durationStr.match(/(\d+)m/);
    const hours = hMatch ? parseInt(hMatch[1]) : 0;
    const minutes = mMatch ? parseInt(mMatch[1]) : 0;
    return hours * 3600 + minutes * 60;
  };

  // ── Fetch active rental on mount & every 30s ──
  useEffect(() => {
    const fetchRental = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        if (!customerId) return;
        const data = await userService.getActiveRental(customerId);
       if (data && data.rentalId) {
  setActiveRental(data);
  if (data.expectedEndTime) {
    const endTime = new Date(data.expectedEndTime);
    const now = new Date();
    const diff = Math.floor((endTime - now) / 1000);
    setTimeRemaining(diff > 0 ? diff : 0);
  }
} else {
  setActiveRental(null);
}
        
      } catch {
        setActiveRental(null);
      }
    };

    fetchRental();
    const poll = setInterval(fetchRental, 30000);
    return () => clearInterval(poll);
  }, []);

  // ── Count UP every second ──
useEffect(() => {
  if (!activeRental || timeRemaining === null) return;
  const tick = setInterval(() => {
    setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);
  return () => clearInterval(tick);
}, [activeRental, timeRemaining === null]);


  // ── Format seconds → HH:MM:SS ──
  const formatTime = (secs) => {
    if (!secs || secs < 0) return "00:00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  // ── Drag — Mouse ──
  const onMouseDown = (e) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.current.y)),
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // ── Drag — Touch ──
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    isDragging.current = true;
    dragOffset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 300, touch.clientX - dragOffset.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 200, touch.clientY - dragOffset.current.y)),
    });
  };

  const onTouchEnd = () => { isDragging.current = false; };

  const getColor = () => {
  if (timeRemaining === null) return "green";
  if (timeRemaining < 600) return "red";
  if (timeRemaining < 1800) return "orange";
  return "green";
};
  // Don't render if no active rental
  if (!activeRental) return null;

  return (
    <div
      ref={barRef}
      className={`ride-bar green ${minimized ? "minimized" : ""}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Handle row */}
      <div className="ride-bar-handle">
        <div className="handle-dots">
          <span/><span/><span/><span/><span/><span/>
        </div>
        <div className="ride-bar-live">
          <span className="ride-bar-dot" />
          LIVE
        </div>
        <button
          className="ride-bar-toggle"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setMinimized(!minimized)}
        >
          {minimized ? "▲" : "▼"}
        </button>
      </div>

      {!minimized && (
        <div className="ride-bar-body">
          {/* Timer */}
          <div className="ride-bar-timer">
           <span className="ride-bar-timer-label">TIME LEFT</span>
<span className={`ride-bar-timer-value ${getColor()}`}>
  {formatTime(timeRemaining)}
</span>
          </div>

          <div className="ride-bar-divider" />

          {/* Info */}
          <div className="ride-bar-info">
            <div className="ride-bar-info-row">
              <span className="rbi-icon">🚲</span>
              <span className="rbi-text">{activeRental.cycleName || "—"}</span>
            </div>
            <div className="ride-bar-info-row">
              <span className="rbi-icon">📍</span>
              <span className="rbi-text">{activeRental.station || "—"}</span>
            </div>
          </div>

          {timeRemaining !== null && timeRemaining <= 600 && timeRemaining > 0 && (
  <div className="ride-bar-warn">⚠️ Return soon!</div>
)}
{timeRemaining === 0 && (
  <div className="ride-bar-expired">🔴 Time up!</div>
)}
        </div>

      )}
    </div>
  );
};

export default RideStatusBar;