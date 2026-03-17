import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
// CORRECT:
import {
  employeeService,
  stationService,
} from "../../service/adminDashboardService";
import "../../style/admin/employeemanagement.css";
import AdminNavbar from "./AdminNavbar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [filterStation, setFilterStation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [actionLoading, setActionLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "Station Employee",
    assignedStation: "",
    role: "EMPLOYEE",
    shift: "",
    salary: "",
    status: "Active",
    joiningDate: new Date().toISOString().split("T")[0], // today's date
  };
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({});

  // ── Load ───────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empData, stationData] = await Promise.all([
        employeeService.getAll(),
        stationService.getAll(),
      ]);
      setEmployees(empData);
      setStations(stationData);
    } catch (err) {
      setError("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "Active" || !e.status).length,
    designations: [
      ...new Set(employees.map((e) => e.designation).filter(Boolean)),
    ],
  };

  // ── Helpers ────────────────────────────────────────────────────
  const getStationName = (stationId) => {
    if (!stationId) return "Unassigned";
    const s = stations.find(
      (s) => s.stationId === stationId || s.stationId === Number(stationId),
    );
    return s ? s.stationName : `Station ${stationId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "On Leave":
        return "#f59e0b";
      case "Inactive":
        return "#ef4444";
      default:
        return "#10b981";
    }
  };

  const getInitials = (name) =>
    (name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // ── Filter ─────────────────────────────────────────────────────
  const filtered = employees.filter((e) => {
    const matchSearch = [e.name, e.employeeEmail || e.email, String(e.id)].some(
      (v) => (v || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const matchDesig =
      filterDesignation === "all" || e.designation === filterDesignation;
    const matchStation =
      filterStation === "all" || String(e.assignedStation) === filterStation;
    const matchStatus =
      filterStatus === "all" || (e.status || "Active") === filterStatus;
    return matchSearch && matchDesig && matchStation && matchStatus;
  });

  // ── CRUD ───────────────────────────────────────────────────────
  const handleAddEmployee = async () => {
    if (!addForm.name || !addForm.email || !addForm.password)
      return alert("Name, Email and Password are required");
    try {
      setActionLoading(true);
      await employeeService.add(addForm);
      setShowAddEmployee(false);
      setAddForm(emptyForm);
      await loadData();
    } catch (err) {
      alert("Failed to add employee");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditEmployee = async () => {
    try {
      setActionLoading(true);
      await employeeService.update(selectedEmployee.id, editForm);
      setShowEditEmployee(false);
      await loadData();
    } catch (err) {
      alert("Failed to update employee");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEmployee = async (empId) => {
    if (!window.confirm("Remove this employee? This cannot be undone.")) return;
    try {
      await employeeService.delete(empId);
      await loadData();
    } catch (err) {
      alert("Failed to delete employee");
    }
  };

  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditForm({
      name: emp.name,
      phone: emp.phone || "",
      designation: emp.designation,
      assignedStation: emp.assignedStation,
      role: emp.role,
      shift: emp.shift || "",
      salary: emp.salary || "",
      status: emp.status || "Active",
      password: "",
    });
    setShowEditEmployee(true);
  };

  // ── UI ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="employee-management">
        <div className="loading-state">
          <RefreshCw size={40} className="spin-icon" />
          <p>Loading employees...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="employee-management">
        <div className="error-state">
          <AlertTriangle size={40} />
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="cycle-fleet-page">
      <AdminNavbar
        isCollapsed={isNavCollapsed}
        setIsCollapsed={setIsNavCollapsed}
      />

      <div
        className={`cycle-fleet-management ${isNavCollapsed ? "navbar-collapsed" : ""}`}
      >
        <div className="employee-management">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-title-section">
                <h1 className="page-title">
                  <span className="title-icon">👥</span>Employee Management
                </h1>
                <p className="page-subtitle">
                  Manage your workforce across all stations
                </p>
              </div>
              <div className="header-actions">
                <button
                  className="add-employee-btn"
                  onClick={() => setShowAddEmployee(true)}
                >
                  <span>➕</span> Add Employee
                </button>
                <button className="export-btn" onClick={loadData}>
                  <span>🔄</span> Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-label">Total Employees</span>
                <span className="stat-value">{stats.total}</span>
                <span className="stat-detail">Across all stations</span>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Active</span>
                <span className="stat-value">{stats.active}</span>
                <span className="stat-detail">
                  {stats.total
                    ? Math.round((stats.active / stats.total) * 100)
                    : 0}
                  % workforce
                </span>
              </div>
            </div>
            <div className="stat-card designation">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-label">Designations</span>
                <span className="stat-value">{stats.designations.length}</span>
                <span className="stat-detail">Different roles</span>
              </div>
            </div>
            <div className="stat-card leave">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <span className="stat-label">Stations Covered</span>
                <span className="stat-value">{stations.length}</span>
                <span className="stat-detail">Active stations</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <div className="search-filter-row">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="filter-controls">
                <select
                  value={filterDesignation}
                  onChange={(e) => setFilterDesignation(e.target.value)}
                >
                  <option value="all">All Designations</option>
                  {stats.designations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStation}
                  onChange={(e) => setFilterStation(e.target.value)}
                >
                  <option value="all">All Stations</option>
                  {stations.map((s) => (
                    <option key={s.stationId} value={String(s.stationId)}>
                      {s.stationName}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="view-toggle">
                  <button
                    className={viewMode === "grid" ? "active" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={viewMode === "list" ? "active" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
            <div className="results-info">
              Showing {filtered.length} of {employees.length} employees
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="employees-grid">
              {filtered.map((emp, index) => (
                <div
                  key={emp.id}
                  className="employee-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card-header">
                    <div className="employee-avatar">
                      {getInitials(emp.name)}
                    </div>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(emp.status) }}
                    >
                      {emp.status || "Active"}
                    </span>
                  </div>
                  <div className="employee-info">
                    <h3 className="employee-name">{emp.name}</h3>
                    <p className="employee-id">ID: #{emp.id}</p>
                    <div className="designation-tag">
                      <span className="badge">
                        {emp.designation || emp.role}
                      </span>
                    </div>
                    <div className="employee-details">
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">
                          {getStationName(emp.assignedStation)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">
                          {emp.employeeEmail || emp.email}
                        </span>
                      </div>
                      {emp.phone && (
                        <div className="detail-item">
                          <span className="detail-icon">📞</span>
                          <span className="detail-text">{emp.phone}</span>
                        </div>
                      )}
                      {emp.shift && (
                        <div className="detail-item">
                          <span className="detail-icon">⏰</span>
                          <span className="detail-text">{emp.shift}</span>
                        </div>
                      )}
                    </div>
                    {emp.salary && (
                      <div className="salary-info">
                        <span className="salary-label">Monthly Salary:</span>
                        <span className="salary-value">
                          ₹{Number(emp.salary).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="card-footer"
                    style={{ display: "flex", gap: "6px" }}
                  >
                    <button
                      className="view-details-btn"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEmployeeDetails(true);
                      }}
                    >
                      View Details →
                    </button>
                    <button
                      className="view-details-btn"
                      style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => openEdit(emp)}
                    >
                      ✏️
                    </button>
                    <button
                      className="view-details-btn"
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteEmployee(emp.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="employees-table-card">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Station</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="table-employee-info">
                          <div className="table-avatar">
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <strong>{emp.name}</strong>
                            <span className="table-employee-id">#{emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="table-designation-badge">
                          {emp.designation}
                        </span>
                      </td>
                      <td>{getStationName(emp.assignedStation)}</td>
                      <td>
                        <div className="table-contact">
                          <span>{emp.employeeEmail || emp.email}</span>
                        </div>
                      </td>
                      <td>{emp.role}</td>
                      <td>
                        <span
                          className="table-status-badge"
                          style={{
                            backgroundColor: getStatusColor(emp.status),
                          }}
                        >
                          {emp.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="table-view-btn"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setShowEmployeeDetails(true);
                          }}
                        >
                          👁️ View
                        </button>
                        <button
                          className="table-view-btn"
                          style={{ marginLeft: "4px" }}
                          onClick={() => openEdit(emp)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="table-view-btn"
                          style={{ marginLeft: "4px", color: "#ef4444" }}
                          onClick={() => handleDeleteEmployee(emp.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div
              style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}
            >
              <p style={{ fontSize: "48px" }}>👥</p>
              <h3>No employees found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}

          {/* ── Employee Details Modal ── */}
          {showEmployeeDetails && selectedEmployee && (
            <div
              className="modal-overlay"
              onClick={() => setShowEmployeeDetails(false)}
            >
              <div
                className="modal-content employee-details-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setShowEmployeeDetails(false)}
                >
                  ✕
                </button>
                <div className="modal-header-employee">
                  <div className="modal-employee-avatar-large">
                    {getInitials(selectedEmployee.name)}
                  </div>
                  <div className="modal-employee-title">
                    <h2>{selectedEmployee.name}</h2>
                    <span className="modal-employee-id">
                      #{selectedEmployee.id}
                    </span>
                    <span className="modal-designation">
                      {selectedEmployee.designation || selectedEmployee.role}
                    </span>
                  </div>
                  <span
                    className="modal-status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedEmployee.status),
                    }}
                  >
                    {selectedEmployee.status || "Active"}
                  </span>
                </div>
                <div className="modal-body-employee">
                  <div className="employee-details-grid">
                    <div className="detail-section">
                      <h3>👤 Personal</h3>
                      {[
                        ["Full Name", selectedEmployee.name],
                        [
                          "Email",
                          selectedEmployee.employeeEmail ||
                            selectedEmployee.email,
                        ],
                        ["Phone", selectedEmployee.phone || "N/A"],
                      ].map(([l, v]) => (
                        <div className="detail-row" key={l}>
                          <span className="detail-label">{l}:</span>
                          <span className="detail-value">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="detail-section">
                      <h3>💼 Work</h3>
                      {[
                        ["Designation", selectedEmployee.designation],
                        ["Role", selectedEmployee.role],
                        [
                          "Station",
                          getStationName(selectedEmployee.assignedStation),
                        ],
                        ["Shift", selectedEmployee.shift || "N/A"],
                      ].map(([l, v]) => (
                        <div className="detail-row" key={l}>
                          <span className="detail-label">{l}:</span>
                          <span className="detail-value">{v}</span>
                        </div>
                      ))}
                    </div>
                    {selectedEmployee.salary && (
                      <div className="detail-section">
                        <h3>💰 Salary</h3>
                        <div className="detail-row">
                          <span className="detail-label">Monthly:</span>
                          <span className="detail-value salary-highlight">
                            ₹{Number(selectedEmployee.salary).toLocaleString()}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Annual:</span>
                          <span className="detail-value">
                            ₹
                            {(
                              Number(selectedEmployee.salary) * 12
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer-employee">
                  <button
                    className="footer-btn secondary"
                    onClick={() => setShowEmployeeDetails(false)}
                  >
                    Close
                  </button>
                  <button
                    className="footer-btn primary"
                    onClick={() => {
                      setShowEmployeeDetails(false);
                      openEdit(selectedEmployee);
                    }}
                  >
                    ✏️ Edit Details
                  </button>
                  <button
                    className="footer-btn action danger"
                    onClick={() => {
                      setShowEmployeeDetails(false);
                      handleDeleteEmployee(selectedEmployee.id);
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Add Employee Modal ── */}
          {showAddEmployee && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddEmployee(false)}
            >
              <div
                className="modal-content add-employee-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setShowAddEmployee(false)}
                >
                  ✕
                </button>
                <div className="modal-header-simple">
                  <h2>Add New Employee</h2>
                </div>
                <div className="modal-body-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={addForm.name}
                        onChange={(e) =>
                          setAddForm({ ...addForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        placeholder="emp@spincity.com"
                        value={addForm.email}
                        onChange={(e) =>
                          setAddForm({ ...addForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        placeholder="Set initial password"
                        value={addForm.password}
                        onChange={(e) =>
                          setAddForm({ ...addForm, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={addForm.phone}
                        onChange={(e) =>
                          setAddForm({ ...addForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <select
                        value={addForm.designation}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            designation: e.target.value,
                          })
                        }
                      >
                        <option value="Station Employee">
                          Station Employee
                        </option>
                        <option value="Cycle Maintenance">
                          Cycle Maintenance
                        </option>
                        <option value="Station Manager">Station Manager</option>
                        <option value="Customer Support">
                          Customer Support
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={addForm.role}
                        onChange={(e) =>
                          setAddForm({ ...addForm, role: e.target.value })
                        }
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Joining Date</label>
                      <input
                        type="date"
                        value={addForm.joiningDate}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            joiningDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Assigned Station</label>
                      <select
                        value={addForm.assignedStation}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            assignedStation: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Station</option>
                        {stations.map((s) => (
                          <option key={s.stationId} value={s.stationId}>
                            {s.stationName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Monthly Salary</label>
                      <input
                        type="number"
                        placeholder="35000"
                        value={addForm.salary}
                        onChange={(e) =>
                          setAddForm({ ...addForm, salary: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Shift Timing</label>
                      <input
                        type="text"
                        placeholder="09:00 AM - 06:00 PM"
                        value={addForm.shift}
                        onChange={(e) =>
                          setAddForm({ ...addForm, shift: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer-simple">
                  <button
                    className="footer-btn secondary"
                    onClick={() => setShowAddEmployee(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="footer-btn primary"
                    onClick={handleAddEmployee}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Adding..." : "➕ Add Employee"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Edit Employee Modal ── */}
          {showEditEmployee && selectedEmployee && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditEmployee(false)}
            >
              <div
                className="modal-content add-employee-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setShowEditEmployee(false)}
                >
                  ✕
                </button>
                <div className="modal-header-simple">
                  <h2>Edit Employee — {selectedEmployee.name}</h2>
                </div>
                <div className="modal-body-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <select
                        value={editForm.designation || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            designation: e.target.value,
                          })
                        }
                      >
                        <option value="Station Employee">
                          Station Employee
                        </option>
                        <option value="Cycle Maintenance">
                          Cycle Maintenance
                        </option>
                        <option value="Station Manager">Station Manager</option>
                        <option value="Customer Support">
                          Customer Support
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Assigned Station</label>
                      <select
                        value={String(editForm.assignedStation) || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            assignedStation: e.target.value,
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {stations.map((s) => (
                          <option key={s.stationId} value={s.stationId}>
                            {s.stationName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Shift Timing</label>
                      <input
                        type="text"
                        value={editForm.shift || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, shift: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Salary</label>
                      <input
                        type="number"
                        value={editForm.salary || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, salary: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editForm.status || "Active"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>New Password (leave blank to keep)</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={editForm.password || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer-simple">
                  <button
                    className="footer-btn secondary"
                    onClick={() => setShowEditEmployee(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="footer-btn primary"
                    onClick={handleEditEmployee}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Saving..." : "✅ Save Changes"}
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

export default EmployeeManagement;
