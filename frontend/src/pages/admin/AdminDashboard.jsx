import React, { useState, useEffect } from "react";
import adminDashboardService from "../../service/adminDashboardService";
import {
  cycleService,
  stationService,
} from "../../service/adminDashboardService";
import "../../style/admin/admindashboard.css";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [recentRentals, setRecentRentals] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summary, rentals, cyclesData, stationsData] = await Promise.all([
        adminDashboardService.getDashboardSummary(),
        adminDashboardService.getRecentRentals(),
        cycleService.getAll(),
        stationService.getAll(),
      ]);

      setDashboardData(summary);
      setRecentRentals(
        Array.isArray(rentals)
          ? rentals
          : rentals.content || rentals.data || [],
      );
      setCycles(
        Array.isArray(cyclesData)
          ? cyclesData
          : cyclesData.content || cyclesData.data || [],
      );
      setStations(
        Array.isArray(stationsData)
          ? stationsData
          : stationsData.content || stationsData.data || [],
      );
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatRentalTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime) return "N/A";
    const diffMs =
      (endTime ? new Date(endTime) : new Date()) - new Date(startTime);
    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
        />
        <div
          className={`admin-dashboard-content ${isNavCollapsed ? "navbar-collapsed" : ""}`}
        >
          <div className="loading-state">
            <div className="loading-spinner">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminNavbar
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
        />
        <div
          className={`admin-dashboard-content ${isNavCollapsed ? "navbar-collapsed" : ""}`}
        >
          <div className="error-state">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchDashboardData}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Real cycle status counts ───────────────────────────────────
  const availableCount = cycles.filter(
    (c) => c.currentStatus === "Available",
  ).length;
  const rentedCount = cycles.filter((c) => c.currentStatus === "Rented").length;
  const maintenanceCount = cycles.filter(
    (c) => c.currentStatus === "Under_Maintenance",
  ).length;
  const damagedCount = cycles.filter(
    (c) => c.currentStatus === "Damaged",
  ).length;
  const totalCycles = cycles.length;

  const pct = (n) =>
    totalCycles > 0 ? Math.round((n / totalCycles) * 100) : 0;

  const cycleOverview = [
    {
      status: "Available",
      count: availableCount,
      percentage: pct(availableCount),
      color: "#10b981",
    },
    {
      status: "Rented",
      count: rentedCount,
      percentage: pct(rentedCount),
      color: "#6366f1",
    },
    {
      status: "Maintenance",
      count: maintenanceCount,
      percentage: pct(maintenanceCount),
      color: "#f59e0b",
    },
    {
      status: "Damaged",
      count: damagedCount,
      percentage: pct(damagedCount),
      color: "#ef4444",
    },
  ];

  // ── Real top stations (by availableCycles as proxy) ───────────
  const topStations = [...stations]
    .sort((a, b) => (b.availableCycles || 0) - (a.availableCycles || 0))
    .slice(0, 5)
    .map((s) => ({
      station: s.stationName,
      available: s.availableCycles || 0,
      capacity: s.totalCapacity || 0,
      status: s.status,
      type: s.stationType || "Standard",
    }));

  // ── Stats cards ────────────────────────────────────────────────
  const stats = [
    {
      id: 1,
      title: "Total Customers",
      value: dashboardData?.totalCustomers?.toLocaleString() || "0",
      icon: "👥",
      color: "blue",
    },
    {
      id: 2,
      title: "Total Cycles",
      value: totalCycles.toLocaleString(),
      icon: "🚴",
      color: "green",
    },
    {
      id: 3,
      title: "Today's Revenue",
      value: `₹${dashboardData?.todayRevenue?.toLocaleString() || "0"}`,
      icon: "💰",
      color: "purple",
    },
    {
      id: 4,
      title: "Active Stations",
      value: dashboardData?.activeStations?.toLocaleString() || "0",
      icon: "📍",
      color: "orange",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminNavbar
        isCollapsed={isNavCollapsed}
        setIsCollapsed={setIsNavCollapsed}
      />

      <div
        className={`admin-dashboard-content ${isNavCollapsed ? "navbar-collapsed" : ""}`}
      >
        {/* Header */}
        <div className="dashboard-header">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <h1 className="welcome-text">
                Welcome, <span className="admin-name">Admin</span>
              </h1>
              <p className="admin-role">System Administrator</p>
            </div>
          </div>
          <div className="header-info-cards">
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-content">
                <p className="info-label">TOTAL STATIONS</p>
                <h3 className="info-value">{stations.length} Active</h3>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <p className="info-label">{formatDate(currentTime)}</p>
                <h3 className="info-value">{formatTime(currentTime)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon-wrapper">
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <div className="stat-bottom">
                  <h2 className="stat-value">{stat.value}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Rentals */}
          <div className="content-card recent-rentals">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">📊</span>
                <h2>Recent Rentals</h2>
              </div>
              <button className="view-all-btn" onClick={fetchDashboardData}>
                Refresh <span className="arrow">🔄</span>
              </button>
            </div>
            <div className="rentals-table">
              <div className="table-header">
                <span>CUSTOMER</span>
                <span>CYCLE</span>
                <span>STATION</span>
                <span>DURATION</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
              </div>
              {recentRentals.length > 0 ? (
                recentRentals.map((rental) => (
                  <div key={rental.rentalId} className="table-row">
                    <span className="customer-name">{rental.customerName}</span>
                    <span className="cycle-id">{rental.cycleName}</span>
                    <span className="cycle-id">{rental.pickupStation}</span>
                    <span className="duration">
                      {calculateDuration(rental.startTime, rental.endTime)}
                    </span>
                    <span className="duration">
                      ₹{rental.amount?.toFixed(0) || "0"}
                    </span>
                    <span
                      className={`status-badge ${rental.status?.toLowerCase()}`}
                    >
                      {rental.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="no-data">No recent rentals found</div>
              )}
            </div>
          </div>

          {/* Cycle Status Overview (replacing alerts) */}
          <div className="content-card alerts-card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">🚲</span>
                <h2>Cycle Status Overview</h2>
              </div>
              <span className="alert-count">{totalCycles} total</span>
            </div>
            <div className="cycle-stats" style={{ padding: "8px 0" }}>
              {cycleOverview.map((item, index) => (
                <div
                  key={index}
                  className="cycle-stat-item"
                  style={{ marginBottom: "16px" }}
                >
                  <div className="cycle-stat-header">
                    <div
                      className="cycle-stat-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="cycle-stat-label">{item.status}</span>
                    <span className="cycle-stat-count">{item.count}</span>
                    <span className="cycle-stat-percentage">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="cycle-stat-bar">
                    <div
                      className="cycle-stat-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          {/* Top Stations — real data */}
          <div className="content-card stations-card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">🏆</span>
                <h2>Stations Overview</h2>
              </div>
            </div>
            <div className="stations-table">
              <div className="table-header">
                <span>STATION</span>
                <span>TYPE</span>
                <span>AVAILABLE</span>
                <span>CAPACITY</span>
                <span>STATUS</span>
              </div>
              {topStations.map((station, index) => (
                <div key={index} className="table-row">
                  <span className="station-name">
                    <span className="station-rank">#{index + 1}</span>
                    {station.station}
                  </span>
                  <span className="rentals-count">{station.type}</span>
                  <span
                    className="revenue-amount"
                    style={{ color: "#10b981", fontWeight: 600 }}
                  >
                    {station.available}
                  </span>
                  <span className="rentals-count">{station.capacity}</span>
                  <span
                    className={`status-badge ${station.status?.toLowerCase()}`}
                  >
                    {station.status}
                  </span>
                </div>
              ))}
              {topStations.length === 0 && (
                <div className="no-data">No stations found</div>
              )}
            </div>
          </div>

          {/* Quick Actions + Summary */}
          <div className="content-card cycle-overview">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">⚡</span>
                <h2>Quick Summary</h2>
              </div>
            </div>

            {/* Summary numbers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                {
                  label: "Available Cycles",
                  value: availableCount,
                  color: "#10b981",
                },
                { label: "Rented Now", value: rentedCount, color: "#6366f1" },
                {
                  label: "In Maintenance",
                  value: maintenanceCount,
                  color: "#f59e0b",
                },
                { label: "Damaged", value: damagedCount, color: "#ef4444" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "14px",
                    borderLeft: `4px solid ${item.color}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => navigate("/customermanagement")}
                >
                  <span>👥</span>Customers
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/cyclefleetmanagement")}
                >
                  <span>🚴</span>Fleet Management
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/adminstation")}
                >
                  <span>📍</span>Stations
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/employeemanagement")}
                >
                  <span>👔</span>Employees
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/feedback")}
                >
                  <span>⭐</span>Feedback
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/alert")}
                >
                  <span>🚨</span>Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;