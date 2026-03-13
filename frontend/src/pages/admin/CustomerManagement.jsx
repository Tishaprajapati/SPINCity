import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import "../../style/admin/customermanagement.css";
import AdminNavbar from "./AdminNavbar";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMembership, setFilterMembership] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  // ── Load ───────────────────────────────────────────────────────
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/admin/customers");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.content || res.data.data || [];
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: "👥",
      color: "blue",
    },
    {
      label: "With Membership",
      value: customers.filter((c) => c.membershipType).length,
      icon: "⭐",
      color: "green",
    },
    {
      label: "Notifications On",
      value: customers.filter((c) => c.notificationsEnabled !== false).length,
      icon: "🔔",
      color: "purple",
    },
    {
      label: "Wallet Balance",
      value: `₹${customers.reduce((s, c) => s + (c.walletBalance || 0), 0).toFixed(0)}`,
      icon: "💰",
      color: "orange",
    },
  ];

  // ── Helpers ────────────────────────────────────────────────────
  const getInitials = (name) =>
    (name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  // ── Filter & Sort ──────────────────────────────────────────────
  const filtered = customers
    .filter((c) => {
      const name = (c.customerName || "").toLowerCase();
      const email = (c.customerEmail || "").toLowerCase();
      const matchSearch =
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());
      const noMembershipTypes = [
        "none",
        "hourly",
        "basic",
        "",
        null,
        undefined,
      ];
      const hasMembership = !noMembershipTypes.includes(
        (c.membershipType || "").toLowerCase().trim(),
      );

      const matchMembership =
        filterMembership === "all" ||
        (filterMembership === "has-plan" && hasMembership) ||
        (filterMembership === "no-plan" && !hasMembership);
      return matchSearch && matchMembership;
    })
    .sort((a, b) => {
      if (sortBy === "name")
        return (a.customerName || "").localeCompare(b.customerName || "");
      if (sortBy === "wallet")
        return (b.walletBalance || 0) - (a.walletBalance || 0);
      if (sortBy === "recent") return (b.customerId || 0) - (a.customerId || 0);
      return 0;
    });

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  // ── UI ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="customer-management">
        <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
          Loading customers...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="customer-management">
        <div style={{ textAlign: "center", padding: "80px", color: "#ef4444" }}>
          <p>{error}</p>
          <button
            onClick={loadCustomers}
            style={{
              marginTop: "12px",
              padding: "8px 20px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="customer-fleet-page">
      <AdminNavbar
        isCollapsed={isNavCollapsed}
        setIsCollapsed={setIsNavCollapsed}
      />
      <div
        className={`customer-management ${isNavCollapsed ? "navbar-collapsed" : ""}`}
      >
        <div className="customer-management">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Customer Management</h1>
              <p className="page-subtitle">
                Manage all customer accounts and memberships
              </p>
            </div>
            <button className="add-customer-btn" onClick={loadCustomers}>
              <span>🔄</span> Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterMembership === "all" ? "active" : ""}`}
                onClick={() => setFilterMembership("all")}
              >
                All Customers
              </button>
              <button
                className={`filter-btn ${filterMembership === "has-plan" ? "active" : ""}`}
                onClick={() => setFilterMembership("has-plan")}
              >
                Has Membership
              </button>
              <button
                className={`filter-btn ${filterMembership === "no-plan" ? "active" : ""}`}
                onClick={() => setFilterMembership("no-plan")}
              >
                No Membership
              </button>
            </div>

            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name</option>
              <option value="wallet">Sort by: Wallet</option>
            </select>
          </div>

          {/* Customers Table */}
          <div className="customers-table-card">
            <div className="table-header">
              <h2 className="table-title">
                <span className="table-icon">📋</span>
                All Customers
                <span
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    fontWeight: 400,
                    marginLeft: "8px",
                  }}
                >
                  ({filtered.length} of {customers.length})
                </span>
              </h2>
              <div className="table-actions">
                <button className="icon-btn" onClick={loadCustomers}>
                  🔄 Refresh
                </button>
              </div>
            </div>

            <div className="customers-table">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Membership</th>
                    <th>Wallet</th>
                    <th>Notifications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer.customerId}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {getInitials(customer.customerName)}
                          </div>
                          <div>
                            <p className="customer-name">
                              {customer.customerName}
                            </p>
                            <p className="customer-rating">
                              ID #{customer.customerId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <p>{customer.customerEmail}</p>
                          <p className="phone-number">
                            {customer.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          {customer.customerAddress || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="membership-cell">
                          <span className="membership-plan">
                            {customer.membershipType || "No Plan"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="spent-amount">
                          ₹{(customer.walletBalance || 0).toFixed(0)}
                        </span>
                      </td>
                      <td>
                        {customer.notificationsEnabled !== false ? (
                          <span className="status-cust-badge verified">
                            ✓ Enabled
                          </span>
                        ) : (
                          <span className="status-cust-badge pending">
                            ✗ Off
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => handleViewDetails(customer)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#94a3b8",
                        }}
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Detail Modal */}
          {showModal && selectedCustomer && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>

                {/* Profile Header */}
                <div className="modal-header">
                  <div className="modal-avatar">
                    {getInitials(selectedCustomer.customerName)}
                  </div>
                  <div className="modal-user-info">
                    <h2>{selectedCustomer.customerName}</h2>
                    <span className="verification-badge verified">
                      {selectedCustomer.notificationsEnabled !== false
                        ? "🔔 Notifications On"
                        : "🔕 Notifications Off"}
                    </span>
                  </div>
                  <div className="modal-stats">
                    <div className="modal-stat-item">
                      <p className="modal-stat-value">
                        #{selectedCustomer.customerId}
                      </p>
                      <p className="modal-stat-label">Customer ID</p>
                    </div>
                    <div className="modal-stat-item">
                      <p className="modal-stat-value">
                        ₹{(selectedCustomer.walletBalance || 0).toFixed(0)}
                      </p>
                      <p className="modal-stat-label">Wallet</p>
                    </div>
                    <div className="modal-stat-item">
                      <p className="modal-stat-value">
                        {formatDate(selectedCustomer.registrationDate)}
                      </p>
                      <p className="modal-stat-label">Joined</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="modal-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="info-grid">
                    {[
                      ["Full Name", selectedCustomer.customerName],
                      ["Email", selectedCustomer.customerEmail],
                      ["Phone", selectedCustomer.customerPhone],
                      [
                        "Age",
                        selectedCustomer.customerAge
                          ? `${selectedCustomer.customerAge} years`
                          : "N/A",
                      ],
                      ["Address", selectedCustomer.customerAddress],
                      [
                        "Membership",
                        selectedCustomer.membershipType || "No Plan",
                      ],
                      ["ID Proof Type", selectedCustomer.idProofType || "N/A"],
                      ["Fav Sport", selectedCustomer.favSport || "N/A"],
                      [
                        "Emergency Name",
                        selectedCustomer.emergencyName || "N/A",
                      ],
                      [
                        "Emergency Contact",
                        selectedCustomer.emergencyContact || "N/A",
                      ],
                    ].map(([label, value]) => (
                      <div className="info-item" key={label}>
                        <label>{label}</label>
                        <p>{value || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-footer">
                  <button className="footer-btn edit-btn" onClick={closeModal}>
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
