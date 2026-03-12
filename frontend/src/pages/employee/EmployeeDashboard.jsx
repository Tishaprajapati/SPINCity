import React, { useState, useEffect } from "react";
import {
  Home,
  Bike,
  ClipboardCheck,
  RefreshCw,
  Calendar,
  ArrowRight,
  Activity,
  DollarSign,
  Users,
  MapPin,
  Wrench,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  X,
  Phone,
  Mail,
  CreditCard,
  Star,
  Clock,
  AlertTriangle,
} from "lucide-react";
import "../../style/employee/employeedashboard.css";
import EmpNavbar from "./Empnavbar";
import {
  fetchDashboardSummary,
  fetchPendingApprovals,
  fetchTodaysRiders,
  fetchCycleConditions,
  approveRide,
  reportDefect,
  collectDeposit,
  returnDeposit,
  fetchCustomerDetails,
  updatePaymentStatus,
  completeRide,  
  forfeitDeposit,
} from "../../service/employeeService";

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [todaysRiders, setTodaysRiders] = useState([]);
  const [cycleConditions, setCycleConditions] = useState([]);

  const [showDefectModal, setShowDefectModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [defectForm, setDefectForm] = useState({
    cycleId: "",
    conditionNote: "",
    conditionStatus: "Minor_Issue",
  });

  const stationId =
    localStorage.getItem("stationId") ||
    localStorage.getItem("assignedStation");
  const empId = localStorage.getItem("staffId");
  const empName = localStorage.getItem("staffName");
  const empRole = localStorage.getItem("staffRole");

  useEffect(() => {
    if (stationId) loadAllData();
  }, [stationId]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(async () => {
      if (!stationId) return;
      try {
        setPendingApprovals(await fetchPendingApprovals(stationId));
      } catch (_) {}
    }, 15000);
    return () => clearInterval(t);
  }, [stationId]);

  const handleCompleteRide = async (transactionId) => {
    try {
      await completeRide(transactionId, empId);
      loadAllData();
    } catch {
      alert("Failed to complete ride");
    }
  };

  const handleForfeitDeposit = async (transactionId) => {
    try {
      await forfeitDeposit(transactionId);
      loadAllData();
    } catch {
      alert("Failed to forfeit deposit");
    }
  };

  const loadAllData = async () => {
    if (!stationId) return;
    setLoading(true);
    try {
      const [dashboard, approvals, riders, conditions] = await Promise.all([
        fetchDashboardSummary(stationId),
        fetchPendingApprovals(stationId),
        fetchTodaysRiders(stationId),
        fetchCycleConditions(stationId),
      ]);
      setDashboardData(dashboard);
      setPendingApprovals(approvals);
      setTodaysRiders(riders);
      setCycleConditions(conditions);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (transactionId, action) => {
    try {
      await approveRide(transactionId, empId, action);
      loadAllData();
    } catch {
      alert("Failed to process approval");
    }
  };

  const handleUpdatePaymentStatus = async (transactionId, status) => {
    try {
      await updatePaymentStatus(transactionId, status);
      loadAllData();
    } catch {
      alert("Failed to update payment status");
    }
  };

  const handleCollectDeposit = async (transactionId) => {
    try {
      await collectDeposit(transactionId);
      loadAllData();
    } catch {
      alert("Failed to collect deposit");
    }
  };

  const handleReturnDeposit = async (transactionId) => {
    try {
      await returnDeposit(transactionId);
      loadAllData();
    } catch {
      alert("Failed to return deposit");
    }
  };

  const handleReportDefect = async () => {
    try {
      await reportDefect(
        defectForm.cycleId,
        defectForm.conditionNote,
        defectForm.conditionStatus,
        empId,
      );
      setShowDefectModal(false);
      setDefectForm({
        cycleId: "",
        conditionNote: "",
        conditionStatus: "Minor_Issue",
      });
      loadAllData();
    } catch {
      alert("Failed to report defect");
    }
  };

  // FIND your handleViewCustomer and make it exactly this:
  const handleViewCustomer = async (customerId) => {
    if (!customerId) return;
    setShowCustomerModal(true);
    setCustomerLoading(true);
    setSelectedCustomer(null);
    try {
      const data = await fetchCustomerDetails(customerId);
      console.log("Customer data received:", data); // temp debug
      setSelectedCustomer(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch customer details");
      setShowCustomerModal(false);
    } finally {
      setCustomerLoading(false);
    }
  };

  const getDepositBadge = (status) => {
    if (status === "COLLECTED")
      return { label: "Collected", color: "#059669", bg: "#d1fae5" };
    if (status === "RETURNED")
      return { label: "Returned", color: "#2563eb", bg: "#dbeafe" };
    return { label: "Not Paid", color: "#dc2626", bg: "#fee2e2" };
  };

  const fmtTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";

  const total = dashboardData?.totalCycles || 0;
  const available = dashboardData?.availableCycles || 0;
  const active = dashboardData?.activeRides || 0;
  const defective = dashboardData?.defectiveCycles || 0;
  const pct = (v) => (total ? Math.round((v / total) * 100) : 0);

  if (loading)
    return (
      <div className="emp-page-wrap">
        <EmpNavbar onCollapse={setSidebarCollapsed} />
        <main className={`emp-main ${sidebarCollapsed ? "collapsed" : ""}`}>
          <div className="emp-loading">
            <div className="emp-spinner" />
            <p>Loading Dashboard...</p>
          </div>
        </main>
      </div>
    );

  return (
    <div className="emp-page-wrap">
      <EmpNavbar onCollapse={setSidebarCollapsed} />

      <main className={`emp-main ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* ── Top Header ────────────────────────────────────────────────── */}
        <div className="emp-topheader">
          <div className="emp-topheader-left">
            <div className="emp-avatar-lg">{empName?.charAt(0) ?? "E"}</div>
            <div>
              <h1 className="emp-welcome">
                Welcome back, <span>{empName ?? "Employee"}</span>
              </h1>
              <div className="emp-meta">
                <span className="emp-role-tag">{empRole ?? "EMPLOYEE"}</span>
                <span className="emp-dot" />
                <span>EMP-{empId}</span>
                <span className="emp-dot" />
                <MapPin size={13} />
                <span>{dashboardData?.stationName || `Station #${stationId}`}</span>
              </div>
            </div>
          </div>
          <div className="emp-topheader-right">
            <div className="emp-infocard">
              <Users size={16} />
              <div>
                <span className="emp-infocard-label">Today's Customers</span>
                <span className="emp-infocard-value">
                  {dashboardData?.todayCustomers ?? 0}
                </span>
              </div>
            </div>
            <div className="emp-infocard">
              <Calendar size={16} />
              <div>
                <span className="emp-infocard-label">
                  {currentTime.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="emp-infocard-value emp-clock">
                  {currentTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <button className="emp-refresh-btn" onClick={loadAllData}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Tab Bar ───────────────────────────────────────────────────── */}
        <div className="emp-tabbar">
          {[
            { key: "dashboard", label: "Dashboard", icon: Home },
            {
              key: "approvals",
              label: `Approvals${pendingApprovals.length > 0 ? ` (${pendingApprovals.length})` : ""}`,
              icon: ClipboardCheck,
              urgent: pendingApprovals.length > 0,
            },
            { key: "riders", label: "Riders", icon: Users },
            { key: "cycles", label: "Cycle Status", icon: Bike },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`emp-tab ${activeTab === tab.key ? "active" : ""} ${tab.urgent ? "urgent" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.urgent && <span className="emp-tab-dot" />}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <>
            <div className="emp-stats-grid">
              {[
                {
                  label: "Available Cycles",
                  value: available,
                  sub: `of ${total} total`,
                  icon: Bike,
                  color: "#10b981",
                  bg: "#d1fae5",
                },
                {
                  label: "Active Rentals",
                  value: active,
                  sub: "rides in progress",
                  icon: Activity,
                  color: "#3b82f6",
                  bg: "#dbeafe",
                },
                {
                  label: "Pending Approvals",
                  value: pendingApprovals.length,
                  sub: "awaiting review",
                  icon: ClipboardCheck,
                  color: "#f59e0b",
                  bg: "#fef3c7",
                },
                {
                  label: "Today's Revenue",
                  value: `₹${dashboardData?.todayRevenue ?? 0}`,
                  sub: "collected today",
                  icon: DollarSign,
                  color: "#8b5cf6",
                  bg: "#ede9fe",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="emp-stat-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="emp-stat-icon"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <s.icon size={22} />
                  </div>
                  <div className="emp-stat-body">
                    <span className="emp-stat-label">{s.label}</span>
                    <span className="emp-stat-value">{s.value}</span>
                    <span className="emp-stat-sub">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="emp-grid-2col">
              {/* Today's Rides */}
              <div className="emp-card">
                <div className="emp-card-header">
                  <h3>
                    <Activity size={18} /> Today's Rides
                  </h3>
                  <button
                    className="emp-link-btn"
                    onClick={() => setActiveTab("riders")}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>
                <div className="emp-table-wrap">
                  <table className="emp-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Cycle</th>
                        <th>Start</th>
                        <th>Status</th>
                        <th>Deposit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysRiders.slice(0, 5).map((r) => {
                        const dep = getDepositBadge(r.depositStatus);
                        return (
                          <tr key={r.transactionId}>
                            <td>
                              <strong>{r.customerName}</strong>
                            </td>
                            <td className="td-accent">{r.cycleName}</td>
                            <td>{fmtTime(r.rentalStartTime)}</td>
                            <td>
                              <span
                                className={`emp-badge status-${r.rentalStatus?.toLowerCase()}`}
                              >
                                {r.rentalStatus}
                              </span>
                            </td>
                            <td>
                              <span
                                className="emp-badge"
                                style={{ background: dep.bg, color: dep.color }}
                              >
                                {dep.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {todaysRiders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="td-empty">
                            No rides today yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="emp-right-col">
                {/* Cycle Chart */}
                <div className="emp-card">
                  <div className="emp-card-header">
                    <h3>
                      <Bike size={18} /> Cycle Overview
                    </h3>
                    <span className="emp-badge-count">{total} Total</span>
                  </div>
                  <div className="emp-cycle-chart">
                    {[
                      {
                        label: "Available",
                        count: available,
                        color: "#10b981",
                        tip:
                          available === 0
                            ? "No cycles available right now!"
                            : `${available} cycles ready to rent`,
                      },
                      {
                        label: "On Rides",
                        count: active,
                        color: "#3b82f6",
                        tip:
                          active === 0
                            ? "No active rides"
                            : `${active} cycles on active rides`,
                      },
                      {
                        label: "Defective",
                        count: defective,
                        color: "#ef4444",
                        tip:
                          defective === 0
                            ? "✅ All cycles are healthy!"
                            : `⚠️ ${defective} cycles need attention`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="emp-chart-row">
                        <div className="emp-chart-meta">
                          <span
                            className="emp-chart-dot"
                            style={{ background: item.color }}
                          />
                          <span className="emp-chart-label">{item.label}</span>
                          <span
                            className="emp-chart-count"
                            style={{ color: item.color }}
                          >
                            {item.count}
                          </span>
                          <span className="emp-chart-pct">
                            {pct(item.count)}%
                          </span>
                        </div>
                        <div className="emp-chart-bar-wrap">
                          <div
                            className="emp-chart-bar-fill"
                            style={{
                              width: `${pct(item.count)}%`,
                              background: item.color,
                            }}
                          />
                          <span className="emp-bar-tooltip">{item.tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="emp-card">
                  <div className="emp-card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="emp-actions-grid">
                    {[
                      {
                        label: "Pending Approvals",
                        icon: ClipboardCheck,
                        action: () => setActiveTab("approvals"),
                        urgent: pendingApprovals.length > 0,
                        count: pendingApprovals.length,
                      },
                      {
                        label: "Report Defect",
                        icon: Wrench,
                        action: () => setShowDefectModal(true),
                      },
                      {
                        label: "Today's Riders",
                        icon: Users,
                        action: () => setActiveTab("riders"),
                      },
                      {
                        label: "Cycle Status",
                        icon: Bike,
                        action: () => setActiveTab("cycles"),
                      },
                    ].map((a, i) => (
                      <button
                        key={i}
                        className={`emp-action-btn ${a.urgent ? "urgent" : ""}`}
                        onClick={a.action}
                      >
                        <a.icon size={20} />
                        <span>{a.label}</span>
                        {a.count > 0 && (
                          <span className="emp-action-count">{a.count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── APPROVALS TAB ────────────────────────────────────────────── */}
        {activeTab === "approvals" && (
          <div className="emp-card">
            <div className="emp-card-header">
              <h3>
                <ClipboardCheck size={18} /> Pending Approvals
              </h3>
              <span
                className={`emp-badge-count ${pendingApprovals.length > 0 ? "urgent" : ""}`}
              >
                {pendingApprovals.length} Pending
              </span>
            </div>
            {pendingApprovals.length === 0 ? (
              <div className="emp-empty-state">
                <CheckCircle size={48} color="#10b981" />
                <p>All caught up! No pending approvals.</p>
              </div>
            ) : (
              <div className="emp-approvals-list">
                {pendingApprovals.map((a) => (
                  <div key={a.transactionId} className="emp-approval-card">
                    <div className="emp-approval-customer">
                      <div className="emp-approval-avatar">
                        {a.customerName?.charAt(0)}
                      </div>
                      <div className="emp-approval-info">
                        <h4>{a.customerName}</h4>
                        <span>
                          <Phone size={12} /> {a.customerPhone}
                        </span>
                      </div>
                    </div>
                    <div className="emp-approval-details">
                      <div className="emp-approval-detail-item">
                        <Bike size={14} />
                        <span>{a.cycleName}</span>
                      </div>
                      <div className="emp-approval-detail-item">
                        <Clock size={14} />
                        <span>{fmtTime(a.rentalStartTime)}</span>
                      </div>
                      <div className="emp-approval-detail-item">
                        <CreditCard size={14} />
                        <span
                          className={`emp-badge status-${a.paymentStatus?.toLowerCase()}`}
                        >
                          {a.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="emp-approval-deposit-notice">
                      <AlertTriangle size={14} />
                      Collect security deposit from customer before approving
                    </div>
                    <div className="emp-approval-actions">
                      <button
                        className="emp-btn-secondary"
                        onClick={() => {
                          console.log("Approval object:", a);
                          console.log("CustomerId:", a.customerId);
                          handleViewCustomer(a.customerId);
                        }}
                      >
                        <Eye size={15} /> View Details
                      </button>
                      {/* ADD this button inside emp-approval-actions div, before Approve button */}
                      {a.paymentStatus !== "Paid" ? (
                        <button
                          className="emp-btn-secondary"
                          onClick={() =>
                            handleUpdatePaymentStatus(a.transactionId, "Paid")
                          }
                        >
                          ✅ Mark as Paid
                        </button>
                      ) : (
                        <span
                          className="emp-badge"
                          style={{ background: "#d1fae5", color: "#059669" }}
                        >
                          ✅ Paid
                        </span>
                      )}

                      <button
                        className="emp-btn-approve"
                        onClick={() =>
                          handleApproval(a.transactionId, "Approved")
                        }
                      >
                        <ThumbsUp size={15} /> Approve
                      </button>
                      <button
                        className="emp-btn-reject"
                        onClick={() =>
                          handleApproval(a.transactionId, "Rejected")
                        }
                      >
                        <ThumbsDown size={15} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RIDERS TAB ───────────────────────────────────────────────── */}
        {activeTab === "riders" && (
          <div className="emp-card">
            <div className="emp-card-header">
              <h3>
                <Users size={18} /> Today's Riders
              </h3>
              <span className="emp-badge-count">
                {todaysRiders.length} Total
              </span>
            </div>
            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Cycle</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Deposit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysRiders.map((r) => {
                    const dep = getDepositBadge(r.depositStatus);
                    return (
                      <tr key={r.transactionId}>
                        <td>
                          <strong>{r.customerName}</strong>
                        </td>
                        <td className="td-muted">{r.customerPhone}</td>
                        <td className="td-accent">{r.cycleName}</td>
                        <td>{fmtTime(r.rentalStartTime)}</td>
                        <td>{fmtTime(r.rentalEndTime)}</td>
                        <td>
                          <span
                            className={`emp-badge status-${r.rentalStatus?.toLowerCase()}`}
                          >
                            {r.rentalStatus}
                          </span>
                        </td>
                        <td>
                          <span
                            className="emp-badge"
                            style={{ background: dep.bg, color: dep.color }}
                          >
                            {dep.label}
                          </span>
                        </td>
                        <td>
                          <div className="td-actions">
                            <button
                              className="emp-btn-sm secondary"
                              onClick={() => handleViewCustomer(r.customerId)}
                            >
                              <Eye size={13} />
                            </button>

                            {/* ✅ Ride waiting to start — collect deposit */}
                            {r.rentalStatus === "Active" &&
                              r.depositStatus === "NOT_PAID" && (
                                <button
                                  className="emp-btn-sm primary"
                                  onClick={() =>
                                    handleCollectDeposit(r.transactionId)
                                  }
                                >
                                  Collect Deposit
                                </button>
                              )}

                            {/* ✅ User requested end ride — show return or forfeit */}
                            {r.rentalStatus === "Pending" &&
                              r.depositStatus === "COLLECTED" && (
                                <>
                                  <button
                                    className="emp-btn-sm green"
                                    onClick={async () => {
                                      await returnDeposit(r.transactionId);
                                      await completeRide(
                                        r.transactionId,
                                        empId,
                                      );
                                      loadAllData();
                                    }}
                                  >
                                    ✅ Return & End
                                  </button>
                                  <button
                                    className="emp-btn-sm danger"
                                    onClick={async () => {
                                      if (
                                        window.confirm(
                                          "Forfeit deposit due to damage?",
                                        )
                                      ) {
                                        await forfeitDeposit(r.transactionId);
                                        await completeRide(
                                          r.transactionId,
                                          empId,
                                        );
                                        loadAllData();
                                      }
                                    }}
                                  >
                                    ❌ Forfeit & End
                                  </button>
                                </>
                              )}

                            {/* ✅ Deposit not collected but user ended ride */}
                            {r.rentalStatus === "Pending" &&
                              r.depositStatus === "NOT_PAID" && (
                                <>
                                  <button
                                    className="emp-btn-sm primary"
                                    onClick={() =>
                                      handleCollectDeposit(r.transactionId)
                                    }
                                  >
                                    Collect Deposit
                                  </button>
                                  <button
                                    className="emp-btn-sm danger"
                                    onClick={async () => {
                                      if (
                                        window.confirm(
                                          "End ride without deposit?",
                                        )
                                      ) {
                                        await completeRide(
                                          r.transactionId,
                                          empId,
                                        );
                                        loadAllData();
                                      }
                                    }}
                                  >
                                    End Ride
                                  </button>
                                </>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {todaysRiders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="td-empty">
                        No riders today yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CYCLES TAB ───────────────────────────────────────────────── */}
        {activeTab === "cycles" && (
          <div className="emp-card">
            <div className="emp-card-header">
              <h3>
                <Bike size={18} /> Cycle Conditions
              </h3>
              <button
                className="emp-link-btn"
                onClick={() => setShowDefectModal(true)}
              >
                + Report Defect
              </button>
            </div>
            {cycleConditions.length === 0 ? (
              <div className="emp-empty-state">
                <CheckCircle size={48} color="#10b981" />
                <p>All cycles are in good condition!</p>
              </div>
            ) : (
              <div className="emp-defects-list">
                {cycleConditions.map((c, i) => (
                  <div
                    key={i}
                    className={`emp-defect-card sev-${c.conditionStatus?.toLowerCase().replace("_", "-")}`}
                  >
                    <div>
                      <span className="emp-defect-id">Cycle #{c.cycleId}</span>
                      <p className="emp-defect-note">{c.conditionNote}</p>
                    </div>
                    <span className="emp-severity-badge sev-${c.conditionStatus?.toLowerCase().replace('_','-')}">
                      {c.conditionStatus?.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Customer Modal ─────────────────────────────────────────────── */}
      {showCustomerModal && (
        <div
          className="emp-modal-overlay"
          onClick={() => setShowCustomerModal(false)}
        >
          <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="emp-modal-close"
              onClick={() => setShowCustomerModal(false)}
            >
              <X size={20} />
            </button>
            {customerLoading ? (
              <div className="emp-modal-loading">
                <div className="emp-spinner" />
                <p>Loading...</p>
              </div>
            ) : (
              selectedCustomer && (
                <>
                  <div className="emp-modal-header">
                    <div className="emp-modal-avatar">
                      {selectedCustomer.customerName?.charAt(0)}
                    </div>
                    <div>
                      <h2>{selectedCustomer.customerName}</h2>
                      <span className="emp-role-tag">
                        Customer #{selectedCustomer.customerId}
                      </span>
                    </div>
                  </div>
                  <div className="emp-modal-grid">
                    <div className="emp-modal-section">
                      <h4>Contact Info</h4>
                      <div className="emp-modal-row">
                        <Phone size={14} />
                        <span>{selectedCustomer.customerPhone}</span>
                      </div>
                      <div className="emp-modal-row">
                        <Mail size={14} />
                        <span>{selectedCustomer.customerEmail}</span>
                      </div>
                      <div className="emp-modal-row">
                        <MapPin size={14} />
                        <span>
                          {selectedCustomer.customerAddress || "Not provided"}
                        </span>
                      </div>
                    </div>
                    <div className="emp-modal-section">
                      <h4>Membership</h4>
                      <div className="emp-modal-row">
                        <Star size={14} />
                        <span>
                          {selectedCustomer.membershipType || "Basic"}
                        </span>
                      </div>
                      <div className="emp-modal-row">
                        <span
                          className={`emp-badge status-${selectedCustomer.membershipStatus?.toLowerCase()}`}
                        >
                          {selectedCustomer.membershipStatus}
                        </span>
                      </div>
                      {selectedCustomer.membershipEndDate && (
                        <div className="emp-modal-row">
                          <Calendar size={14} />
                          <span>
                            Until: {selectedCustomer.membershipEndDate}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="emp-modal-section">
                      <h4>Stats</h4>
                      <div className="emp-modal-row">
                        <Activity size={14} />
                        <span>
                          {selectedCustomer.totalRides ?? 0} total rides
                        </span>
                      </div>
                      <div className="emp-modal-row">
                        <DollarSign size={14} />
                        <span>
                          Wallet: ₹{selectedCustomer.walletBalance ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="emp-modal-section full-width">
                      <h4>ID Proof / Document</h4>
                      {selectedCustomer.idProofUrl ? (
                        <div className="emp-id-proof">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                              background: "#f0f4ff",
                              border: "1px solid #c7d2fe",
                              borderRadius: "12px",
                              padding: "1rem 1.25rem",
                            }}
                          >
                            <span style={{ fontSize: "2.5rem" }}>
                              {selectedCustomer.idProofUrl.endsWith(".pdf")
                                ? "📄"
                                : "🪪"}
                            </span>
                            <div>
                              <p
                                style={{
                                  margin: "0 0 0.25rem",
                                  fontWeight: 700,
                                  color: "#1a202c",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {selectedCustomer.idProofType ||
                                  "ID Proof Document"}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "0.8rem",
                                  color: "#64748b",
                                }}
                              >
                                {selectedCustomer.idProofUrl.split("/").pop()}
                              </p>
                            </div>
                          </div>
                          <a
                            href={
                              selectedCustomer.idProofUrl.startsWith("http")
                                ? selectedCustomer.idProofUrl
                                : `http://localhost:8080${selectedCustomer.idProofUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="emp-btn-secondary"
                            style={{
                              marginTop: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Eye size={14} /> View Full Document
                          </a>
                        </div>
                      ) : (
                        <p style={{ color: "#94a3b8" }}>No ID proof uploaded</p>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Defect Modal ───────────────────────────────────────────────── */}
      {showDefectModal && (
        <div
          className="emp-modal-overlay"
          onClick={() => setShowDefectModal(false)}
        >
          <div className="emp-modal small" onClick={(e) => e.stopPropagation()}>
            <button
              className="emp-modal-close"
              onClick={() => setShowDefectModal(false)}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: "1.5rem", fontWeight: 700 }}>
              🔧 Report Cycle Defect
            </h3>
            <div className="emp-form-stack">
              <input
                type="number"
                placeholder="Cycle ID"
                value={defectForm.cycleId}
                onChange={(e) =>
                  setDefectForm({ ...defectForm, cycleId: e.target.value })
                }
                className="emp-input"
              />
              <textarea
                placeholder="Describe the defect..."
                value={defectForm.conditionNote}
                onChange={(e) =>
                  setDefectForm({
                    ...defectForm,
                    conditionNote: e.target.value,
                  })
                }
                rows={3}
                className="emp-input"
              />
              <select
                value={defectForm.conditionStatus}
                onChange={(e) =>
                  setDefectForm({
                    ...defectForm,
                    conditionStatus: e.target.value,
                  })
                }
                className="emp-input"
              >
                <option value="Minor_Issue">Minor Issue</option>
                <option value="Major_Issue">Major Issue</option>
                <option value="Critical">Critical</option>
              </select>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  className="emp-btn-approve"
                  style={{ flex: 1 }}
                  onClick={handleReportDefect}
                >
                  Submit
                </button>
                <button
                  className="emp-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowDefectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
