import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../service/userService";
import "../../style/user/rentcycle.css";
import cycle from "../../assets/video/v2.mp4";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import SafetyTips from "./SafetyTips.jsx";
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

const CATEGORIES = [
  { id: "1", name: "Gear Cycle",     abbr: "Gear",     tagColor: "#2d5a3d", emoji: "⚙️" },
  { id: "2", name: "Non-Gear Cycle", abbr: "Non-Gear", tagColor: "#4a7c8e", emoji: "🚲" },
  { id: "3", name: "Kids Cycle",     abbr: "Kids",     tagColor: "#c9a84c", emoji: "🌟" },
  { id: "4", name: "Women Cycle",    abbr: "Women",    tagColor: "#8e5a7c", emoji: "🌸" },
  { id: "5", name: "City Cycle",     abbr: "City",     tagColor: "#5a6e8e", emoji: "🏙️" },
  { id: "6", name: "Electric Cycle", abbr: "Electric", tagColor: "#2d7a5a", emoji: "⚡" },
];

const CATEGORY_TEXT = {
  1: "Gear", 2: "Non-Gear", 3: "Kids",
  4: "Women", 5: "City", 6: "Electric",
};

// Vite bulk import — grabs everything in the stations folder
const stationImageModules = import.meta.glob(
  "../../assets/images/stations/*",
  { eager: true }
);

// Helper to get image URL by filename
const getStationImgByFile = (filename) => {
  const entry = Object.entries(stationImageModules).find(([path]) =>
    path.toLowerCase().includes(filename.toLowerCase())
  );
  return entry ? entry[1].default : null;
};

// Map station name keywords → exact filenames in your folder
const STATION_IMAGE_MAP = {
  "riverfront":         "riverfront.jpeg",
  "satellite":          "sattelight.jpeg",
  "manek chowk":        "manekchok.JPG",
  "manekchowk":         "manekchok.JPG",
  "iim":                "iim.jpg",
  "sabarmati":          "sabarmati.webp",
  "bopal":              "bopal.png",
  "gujarat university": "gujaratuniversity.jpg",
  "thaltej":            "thaltej.webp",
  "kankaria":           "kakariya.jpg",
  "kakariya":           "kakariya.jpg",
  "bodakdev":           "bodakdev.avif",
};

const getStationImage = (stationName) => {
  if (!stationName) return getStationImgByFile("common.jpg");
  const lower = stationName.toLowerCase();
  for (const [keyword, filename] of Object.entries(STATION_IMAGE_MAP)) {
    if (lower.includes(keyword)) return getStationImgByFile(filename);
  }
  return getStationImgByFile("common.jpg");
};


function RentCycle() {
  const [selectedBike, setSelectedBike]       = useState(null);
  const [bikes, setBikes]                     = useState([]);
  const [allBikes, setAllBikes]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [activeFilter, setActiveFilter]       = useState(null);
  const [stations, setStations]               = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loadingStation, setLoadingStation]   = useState(false);
  const [stationSelected, setStationSelected] = useState(false);
  const [heroVisible, setHeroVisible]         = useState(true);
  const [scrolled, setScrolled]               = useState(false);

  const gridRef    = useRef(null);
  const heroRef    = useRef(null);
  const navigate   = useNavigate();

  const [showAllStations, setShowAllStations] = useState(false);
const [stationSearch, setStationSearch]     = useState("");
const overlayRef = useRef(null);
  // Mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const root = document.querySelector(".rc-root");
      if (root) {
        root.style.setProperty("--mouse-x", `${(e.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty("--mouse-y", `${(e.clientY / window.innerHeight) * 100}%`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch stations
  useEffect(() => {
    userService.getAllStations().then(setStations).catch(console.error);
  }, []);

  // Fetch all bikes
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await userService.getAllAvailableCycles();
        setAllBikes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStationCategoryCount = (catId) =>
    bikes.filter((b) => String(b.cycleType) === String(catId)).length;

  const getCategoryCount = (catId) => {
    const text = CATEGORY_TEXT[catId];
    return allBikes.filter(
      (b) => b.cycleCategory === text || String(b.cycleType) === String(catId)
    ).length;
  };

  const displayedBikes = activeFilter
    ? bikes.filter((b) => String(b.cycleType) === String(activeFilter))
    : bikes;

  const handleStationSelect = async (station) => {
    setSelectedStation(station);
    setSelectedBike(null);
    setActiveFilter(null);

    if (!station) {
      setStationSelected(false);
      setBikes([]);
      return;
    }

    setStationSelected(true);

    // Smooth scroll to grid
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    try {
      setLoadingStation(true);
      const stationData = await userService.getStationCycles(station.stationId);
      const availableIds = stationData
        .filter((c) => c.currentStatus === "Available")
        .map((c) => c.cycleId);
      setBikes(allBikes.filter((b) => availableIds.includes(b.cycleId)));
    } catch (e) {
      console.error(e);
      setBikes([]);
    } finally {
      setLoadingStation(false);
    }
  };

  const getCategoryTag = (cycleType) =>
    CATEGORIES.find((c) => c.id === String(cycleType)) || { tagColor: "#2d5a3d", abbr: "Cycle" };

  return (
    <div className="rc-root">
      <Navbar />

      {/* ══════════ CINEMATIC HERO ══════════ */}
      <section className="rc-hero" ref={heroRef}>
        <video className="rc-hero-video" src={cycle} autoPlay loop muted playsInline />
        <div className="rc-hero-overlay" />

        {/* Grain texture overlay */}
        <div className="rc-hero-grain" />

        <div className="rc-hero-content">
          <div className="rc-hero-eyebrow">
            <span className="rc-eyebrow-dot" />
            SpinCity · Ahmedabad
          </div>
          <h1 className="rc-hero-title">
            Find Your<br />
            <em>Perfect Ride</em>
          </h1>
          <p className="rc-hero-sub">
            {loading
              ? "Loading cycles…"
              : `${allBikes.length} cycles · ${stations.length} stations`}
          </p>

          {/* Scroll cue */}
          <div className="rc-scroll-cue">
            <span>Choose a station</span>
            <div className="rc-scroll-line" />
          </div>
        </div>

        {/* Floating stats */}
        <div className="rc-hero-pills">
          <div className="rc-hero-pill">
            <span className="rc-pill-val">{allBikes.length}</span>
            <span className="rc-pill-lbl">Cycles</span>
          </div>
          <div className="rc-hero-pill">
            <span className="rc-pill-val">{stations.length}</span>
            <span className="rc-pill-lbl">Stations</span>
          </div>
          <div className="rc-hero-pill">
            <span className="rc-pill-val">6</span>
            <span className="rc-pill-lbl">Categories</span>
          </div>
        </div>
      </section>

     {/* ══════════ STATION SELECTOR ══════════ */}
<section className="rc-station-section">
  <div className="rc-station-header">
    <div className="rc-station-header-left">
      <h2 className="rc-station-title">Choose Your Station</h2>
      <p className="rc-station-sub">
        {selectedStation
          ? `${bikes.length} cycles ready at ${selectedStation.stationName}`
          : "Select a pickup point to see available cycles"}
      </p>
    </div>
    {selectedStation && (
      <button className="rc-clear-btn" onClick={() => handleStationSelect(null)}>
        ✕ Clear
      </button>
    )}
  </div>

  {/* First 5 chips + Browse All button */}
  <div className="rc-station-scroll-wrap">
    <div className="rc-station-chips">
      {stations.slice(0, 5).map((s, i) => (
        <button
          key={s.stationId}
          className={`rc-station-chip ${selectedStation?.stationId === s.stationId ? "active" : ""}`}
          style={{ animationDelay: `${i * 0.04}s` }}
          onClick={() => handleStationSelect(s)}
        >
          <span className="rc-chip-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="rc-chip-text">
            <span className="rc-chip-name">{s.stationName}</span>
            {s.stationAddress && (
              <span className="rc-chip-addr">{s.stationAddress}</span>
            )}
          </div>
          {selectedStation?.stationId === s.stationId && (
            <span className="rc-chip-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>
      ))}

      {/* Browse All chip */}
      {stations.length > 5 && (
        <button
          className="rc-browse-all-chip"
          onClick={() => setShowAllStations(true)}
        >
          <span className="rc-browse-grid-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </span>
          <span>Browse All {stations.length} Stations</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}
    </div>
  </div>

  {/* Stats bar */}
  {stationSelected && selectedStation && !loadingStation && (
    <div className="rc-station-stats-bar">
      <div className="rc-ssb-item">
        <span className="rc-ssb-val">{bikes.length}</span>
        <span className="rc-ssb-lbl">Available Now</span>
      </div>
      <div className="rc-ssb-div" />
      <div className="rc-ssb-item">
        <span className="rc-ssb-val">{selectedStation.totalCapacity || "—"}</span>
        <span className="rc-ssb-lbl">Total Capacity</span>
      </div>
      <div className="rc-ssb-div" />
      <div className="rc-ssb-item">
        <span className="rc-ssb-val">
          {CATEGORIES.filter((c) => getStationCategoryCount(c.id) > 0).length}
        </span>
        <span className="rc-ssb-lbl">Cycle Types</span>
      </div>
      <div className="rc-ssb-div" />
      <div className="rc-ssb-item">
        <span className="rc-ssb-val rc-ssb-open">Open</span>
        <span className="rc-ssb-lbl">Station Status</span>
      </div>
    </div>
  )}
</section>

{/* ══════════ ALL STATIONS OVERLAY ══════════ */}
{showAllStations && (
  <div
    className="rc-overlay"
    onClick={(e) => { if (e.target === e.currentTarget) setShowAllStations(false); }}
  >
    <div className="rc-overlay-panel" ref={overlayRef}>

      {/* Header */}
      <div className="rc-overlay-header">
        <div className="rc-overlay-header-left">
          <h2 className="rc-overlay-title">All Stations</h2>
          <p className="rc-overlay-sub">{stations.length} pickup points across Ahmedabad</p>
        </div>
        <div className="rc-overlay-header-right">
          {/* Search */}
          <div className="rc-overlay-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search station…"
              value={stationSearch}
              onChange={(e) => setStationSearch(e.target.value)}
              autoFocus
            />
            {stationSearch && (
              <button onClick={() => setStationSearch("")}>✕</button>
            )}
          </div>
          <button className="rc-overlay-close" onClick={() => setShowAllStations(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Station image cards grid */}
      <div className="rc-overlay-grid">
        {stations
          .filter(s =>
            !stationSearch ||
            s.stationName.toLowerCase().includes(stationSearch.toLowerCase())
          )
          .map((s, i) => (
            <button
              key={s.stationId}
              className={`rc-overlay-card ${selectedStation?.stationId === s.stationId ? "active" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => {
                handleStationSelect(s);
                setShowAllStations(false);
                setStationSearch("");
              }}
            >
              {/* Station image */}
              <div className="rc-overlay-card-img">
                <img
                  src={getStationImage(s.stationName)}
                  alt={s.stationName}
                  onError={(e) => { e.target.src = getStationImgByFile("common.jpg"); }}
                />
                <div className="rc-overlay-card-gradient" />
                {selectedStation?.stationId === s.stationId && (
                  <div className="rc-overlay-card-selected">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="rc-overlay-card-body">
                <p className="rc-overlay-card-name">{s.stationName}</p>
                {s.stationAddress && (
                  <p className="rc-overlay-card-addr">{s.stationAddress}</p>
                )}
                <span className="rc-overlay-card-cta">
                  View Cycles
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  </div>
)}
      {/* ══════════ MAIN CONTENT AREA ══════════ */}
      <div className="rc-content" ref={gridRef}>

        {/* ── Category filter strip ── */}
        {stationSelected && !loadingStation && bikes.length > 0 && (
          <div className="rc-filter-bar">
            <button
              className={`rc-filter-chip ${activeFilter === null ? "active" : ""}`}
              onClick={() => { setActiveFilter(null); setSelectedBike(null); }}
            >
              All
              <em>{bikes.length}</em>
            </button>
            {CATEGORIES.map((cat) => {
              const count = getStationCategoryCount(cat.id);
              if (!count) return null;
              return (
                <button
                  key={cat.id}
                  className={`rc-filter-chip ${activeFilter === cat.id ? "active" : ""}`}
                  style={{ "--fc": cat.tagColor }}
                  onClick={() => { setActiveFilter(cat.id); setSelectedBike(null); }}
                >
                  <span className="rc-fc-dot" style={{ background: cat.tagColor }} />
                  {cat.abbr}
                  <em>{count}</em>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Pre-selection showcase ── */}
        {!stationSelected && !loading && (
          <div className="rc-showcase">
            <div className="rc-showcase-intro">
              <p className="rc-showcase-eyebrow">Our Fleet</p>
              <h3 className="rc-showcase-title">6 Categories of Cycles</h3>
              <p className="rc-showcase-desc">
                {allBikes.length} cycles available across Ahmedabad — pick a station above to explore
              </p>
            </div>

            <div className="rc-cat-grid">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.id}
                  className="rc-cat-card"
                  style={{
                    "--cat-accent": cat.tagColor,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="rc-cat-img-wrap">
                    <img
                      src={getCategoryImage(parseInt(cat.id))}
                      alt={cat.name}
                      className="rc-cat-img"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="rc-cat-overlay" />
                  </div>
                  <div className="rc-cat-body">
                    <span className="rc-cat-emoji">{cat.emoji}</span>
                    <p className="rc-cat-name">{cat.name}</p>
                    <span className="rc-cat-count">{getCategoryCount(cat.id)} cycles</span>
                  </div>
                  <div className="rc-cat-accent-bar" style={{ background: cat.tagColor }} />
                </div>
              ))}
            </div>

            <div className="rc-select-prompt">
              <div className="rc-prompt-line" />
              <span>Select a station above to browse available cycles</span>
              <div className="rc-prompt-line" />
            </div>
          </div>
        )}

        {/* ── Loading state ── */}
        {loadingStation && (
          <div className="rc-loading-state">
            <div className="rc-loading-ring">
              <div /><div /><div /><div />
            </div>
            <p>Finding cycles at <strong>{selectedStation?.stationName}</strong>…</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {stationSelected && !loadingStation && bikes.length === 0 && (
          <div className="rc-empty-state">
            <div className="rc-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 000-2v2zm-9.5 5.5L7 7l4 4.5m4-5.5l2 5.5M7 7l2-1h4l3 5.5" />
              </svg>
            </div>
            <h3>No cycles available here</h3>
            <p>All cycles at this station are currently out. Try a nearby station.</p>
            <button
              className="rc-btn rc-btn-outline"
              onClick={() => handleStationSelect(null)}
            >
              Browse Other Stations
            </button>
          </div>
        )}

        {/* ── CYCLE GRID ── */}
        {stationSelected && !loadingStation && displayedBikes.length > 0 && (
          <div className="rc-cycle-grid">
            {displayedBikes.map((bike, idx) => {
              const cat = getCategoryTag(bike.cycleType);
              const isSelected = selectedBike?.cycleId === bike.cycleId;
              return (
                <div
                  key={bike.cycleId}
                  className={`rc-cycle-card ${isSelected ? "selected" : ""}`}
                  style={{ animationDelay: `${idx * 0.07}s` }}
                  onClick={() => setSelectedBike(isSelected ? null : bike)}
                >
                  {/* Image */}
                  <div className="rc-cycle-img-wrap">
                    <img
                      src={
                        bike.imagePath
                          ? `http://localhost:8080${bike.imagePath}`
                          : getCategoryImage(bike.cycleType)
                      }
                      alt={bike.cycleName}
                      className="rc-cycle-img"
                      loading="lazy"
                    />
                    <div className="rc-cycle-img-overlay" />
                    <span className="rc-cycle-tag" style={{ background: cat.tagColor }}>
                      {cat.abbr}
                    </span>
                    <div className="rc-avail-dot" />
                    {isSelected && (
                      <div className="rc-selected-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Selected
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="rc-cycle-body">
                    <div className="rc-cycle-header">
                      <div>
                        <h3 className="rc-cycle-name">{bike.cycleName}</h3>
                        <p className="rc-cycle-brand">{bike.cycleBrand} · {bike.cycleModel}</p>
                      </div>
                    </div>

                    {/* Feature pills */}
                    {bike.point1 && (
                      <div className="rc-cycle-feats">
                        {[bike.point1, bike.point2, bike.point3, bike.point4, bike.point5]
                          .filter(Boolean)
                          .map((pt, i) => (
                            <span key={i} className="rc-feat-pill">{pt}</span>
                          ))}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="rc-pricing-row">
                      <div className="rc-price-cell">
                        <span className="rc-price-amt">₹{bike.pricePerHour}</span>
                        <span className="rc-price-per">/ hr</span>
                      </div>
                      <div className="rc-price-div" />
                      <div className="rc-price-cell">
                        <span className="rc-price-amt">₹{bike.dailyPrice}</span>
                        <span className="rc-price-per">/ day</span>
                      </div>
                      <div className="rc-price-div" />
                      <div className="rc-price-cell">
                        <span className="rc-price-amt">₹{bike.weeklyPrice}</span>
                        <span className="rc-price-per">/ wk</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className={`rc-select-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBike(isSelected ? null : bike);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Selected
                        </>
                      ) : (
                        <>
                          Select This Cycle
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════ WHY SPINCITY ══════════ */}
      <section className="rc-why">
        <div className="rc-why-inner">
          <p className="rc-why-eyebrow">Why Us</p>
          <h2 className="rc-why-title">Rent With Confidence</h2>
          <div className="rc-why-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Flexible Plans",
                text: "Hourly, daily, weekly or monthly — your choice, your pace",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Premium Quality",
                text: "Every cycle inspected and serviced before your ride",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                ),
                title: "Best Prices",
                text: "Transparent pricing, zero hidden charges, ever",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                ),
                title: "24/7 Support",
                text: "We're always here whenever you need us",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="rc-why-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="rc-why-icon">{item.icon}</div>
                <h4 className="rc-why-card-title">{item.title}</h4>
                <p className="rc-why-card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BOOKING BAR ══════════ */}
      {selectedBike && (
        <div className="rc-booking-bar">
          <div className="rc-booking-bar-inner">
            <div className="rc-booking-cycle-img">
              <img
                src={
                  selectedBike.imagePath
                    ? `http://localhost:8080${selectedBike.imagePath}`
                    : getCategoryImage(selectedBike.cycleType)
                }
                alt={selectedBike.cycleName}
              />
            </div>
            <div className="rc-booking-info">
              <p className="rc-booking-name">{selectedBike.cycleName}</p>
              <p className="rc-booking-station">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {selectedStation?.stationName}
              </p>
            </div>
            <div className="rc-booking-pricing">
              <span className="rc-booking-price">₹{selectedBike.dailyPrice}</span>
              <span className="rc-booking-per">/ day</span>
            </div>
            <div className="rc-booking-actions">
              <button
                className="rc-deselect-btn"
                onClick={() => setSelectedBike(null)}
              >
                ✕
              </button>
              <button
                className="rc-confirm-btn"
                onClick={() =>
                  navigate("/bookingconfirmation", {
                    state: {
                      selectedBike,
                      selectedStation: { ...selectedStation },
                    },
                  })
                }
              >
                Confirm Booking
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
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
}

export default RentCycle;