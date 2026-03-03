import React, { useState, useEffect } from 'react';
import {
  Home, Bike, AlertCircle, ClipboardCheck, Package,
  TrendingUp, Users, Clock, MapPin, Battery, Wrench,
  CheckCircle, XCircle, RefreshCw, Bell, Calendar,
  ArrowRight, Activity, DollarSign, Star, Eye,
  ThumbsUp, ThumbsDown, AlertTriangle
} from 'lucide-react';
import '../../style/employee/employeedashboard.css';
import {
  fetchDashboardSummary,
  fetchPendingApprovals,
  fetchTodaysRiders,
  fetchCycleConditions,
  approveRide,
  reportDefect,
  collectDeposit,
  returnDeposit,
} from '../../service/employeeService';
import EmpNavbar from './Empnavbar';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real data from API
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [todaysRiders, setTodaysRiders] = useState([]);
  const [cycleConditions, setCycleConditions] = useState([]);


  
  // Defect report modal
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [defectForm, setDefectForm] = useState({
    cycleId: '',
    conditionNote: '',
    conditionStatus: 'Minor_Issue',
  });

  // From localStorage
 const stationId = localStorage.getItem("stationId");
const empId = localStorage.getItem("staffId");

console.log("🔍 DASHBOARD INIT:", {
  stationId,
  empId,
  token: localStorage.getItem("token")
});
  const empName = localStorage.getItem("staffName");
  const empRole = localStorage.getItem("staffRole");

  // ── Load Data ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (stationId) loadAllData();
  }, [stationId]);

const loadAllData = async () => {
  if (!stationId) {
    console.warn("❌ stationId is missing:", stationId);
    return;
  }

  console.log("🚀 loadAllData started, stationId:", stationId);
  setLoading(true);

  try {
    console.log("📡 Firing all 4 API calls...");

    const [dashboard, approvals, riders, conditions] = await Promise.all([
      fetchDashboardSummary(stationId).then(r => { console.log("✅ dashboard done", r); return r; }),
      fetchPendingApprovals(stationId).then(r => { console.log("✅ approvals done", r); return r; }),
      fetchTodaysRiders(stationId).then(r => { console.log("✅ riders done", r); return r; }),
      fetchCycleConditions(stationId).then(r => { console.log("✅ conditions done", r); return r; }),
    ]);

    console.log("✅ All calls resolved, setting state...");
    setDashboardData(dashboard);
    setPendingApprovals(approvals);
    setTodaysRiders(riders);
    setCycleConditions(conditions);
    console.log("✅ State set, loading should stop");

  } catch (err) {
    console.error("❌ Error in loadAllData:", err);
  } finally {
    console.log("🏁 Finally block reached, setLoading(false)");
    setLoading(false);
  }
};

  // ── Clock ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleApproval = async (transactionId, action) => {
    try {
      await approveRide(transactionId, empId, action);
      alert(`Ride ${action} successfully!`);
      loadAllData();
    } catch (err) {
      alert("Failed to process approval");
    }
  };

  const handleCollectDeposit = async (transactionId) => {
    try {
      await collectDeposit(transactionId);
      alert("Deposit collected!");
      loadAllData();
    } catch (err) {
      alert("Failed to collect deposit");
    }
  };

  const handleReturnDeposit = async (transactionId) => {
    try {
      await returnDeposit(transactionId);
      alert("Deposit returned!");
      loadAllData();
    } catch (err) {
      alert("Failed to return deposit");
    }
  };

  const handleReportDefect = async () => {
    try {
      await reportDefect(
        defectForm.cycleId,
        defectForm.conditionNote,
        defectForm.conditionStatus,
        empId
      );
      alert("Defect reported successfully!");
      setShowDefectModal(false);
      setDefectForm({ cycleId: '', conditionNote: '', conditionStatus: 'Minor_Issue' });
      loadAllData();
    } catch (err) {
      alert("Failed to report defect");
    }
  };

  // ── Quick Stats ─────────────────────────────────────────────────────────────

  const quickStats = [
    {
      id: 1,
      title: 'Available Cycles',
      value: dashboardData?.availableCycles ?? '--',
      total: dashboardData?.totalCycles ?? '--',
      icon: Bike,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      id: 2,
      title: 'Active Rentals',
      value: dashboardData?.activeRides ?? '--',
      icon: Activity,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      id: 3,
      title: 'Pending Approvals',
      value: dashboardData?.pendingApprovals ?? '--',
      icon: ClipboardCheck,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      id: 4,
      title: "Today's Revenue",
      value: dashboardData ? `₹${dashboardData.todayRevenue}` : '--',
      icon: DollarSign,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  const cyclesStatus = [
    {
      status: 'Available',
      count: dashboardData?.availableCycles ?? 0,
      color: '#10b981',
      percentage: dashboardData?.totalCycles
        ? Math.round((dashboardData.availableCycles / dashboardData.totalCycles) * 100)
        : 0,
    },
    {
      status: 'Active Rides',
      count: dashboardData?.activeRides ?? 0,
      color: '#3b82f6',
      percentage: dashboardData?.totalCycles
        ? Math.round((dashboardData.activeRides / dashboardData.totalCycles) * 100)
        : 0,
    },
    {
      status: 'Defective',
      count: dashboardData?.defectiveCycles ?? 0,
      color: '#f59e0b',
      percentage: dashboardData?.totalCycles
        ? Math.round((dashboardData.defectiveCycles / dashboardData.totalCycles) * 100)
        : 0,
    },
  ];

  const getDepositBadge = (status) => {
    switch (status) {
      case 'COLLECTED': return { label: 'Collected', color: '#059669', bg: '#d1fae5' };
      case 'RETURNED': return { label: 'Returned', color: '#2563eb', bg: '#dbeafe' };
      default: return { label: 'Not Paid', color: '#dc2626', bg: '#fee2e2' };
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="employee-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <EmpNavbar/>
      <div className="dashboard-header">
        <div className="header-left">
          <div className="employee-info">
            <div className="employee-avatar">
              <span>{empName?.charAt(0) ?? 'E'}</span>
            </div>
            <div className="employee-details">
              <h1 className="employee-name">Welcome, {empName ?? 'Employee'}</h1>
              <div className="employee-meta">
                <span className="designation">{empRole ?? 'Station Employee'}</span>
                <span className="separator">•</span>
                <span className="employee-id">EMP-{empId}</span>
                <span className="separator">•</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Station ID: {stationId}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="station-info-card">
            <MapPin size={20} />
            <div>
              <p className="station-label">Station</p>
              <p className="station-name">{dashboardData?.stationName ?? `Station #${stationId}`}</p>
            </div>
          </div>
          <div className="shift-info-card">
            <Users size={20} />
            <div>
              <p className="shift-label">Today's Customers</p>
              <p className="shift-time">{dashboardData?.todayCustomers ?? '--'}</p>
            </div>
          </div>
          <div className="time-card">
            <Calendar size={20} />
            <div>
              <p className="current-date">{currentTime.toLocaleDateString('en-IN', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
              })}</p>
              <p className="current-time">{currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
              })}</p>
            </div>
          </div>
          <button
            onClick={loadAllData}
            style={{
              background: '#667eea', color: 'white', border: 'none',
              borderRadius: '12px', padding: '0.8rem 1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
            }}
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '2rem',
        background: 'white', padding: '0.5rem', borderRadius: '14px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflowX: 'auto'
      }}>
        {[
          { key: 'dashboard', label: 'Dashboard', icon: Home },
          { key: 'approvals', label: `Approvals ${pendingApprovals.length > 0 ? `(${pendingApprovals.length})` : ''}`, icon: ClipboardCheck },
          { key: 'riders', label: 'Riders', icon: Users },
          { key: 'cycles', label: 'Cycle Status', icon: Bike },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.2rem', borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
              background: activeTab === tab.key
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
              color: activeTab === tab.key ? 'white' : '#64748b',
              transition: 'all 0.3s ease',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Dashboard Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <>
          {/* Quick Stats */}
          <div className="quick-stats-grid">
            {quickStats.map((stat, index) => (
              <div key={stat.id} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <div className="stat-value-row">
                    <h3 className="stat-value">
                      {stat.value}
                      {stat.total && <span className="stat-total">/{stat.total}</span>}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="main-content-grid">
            <div className="left-column">
              {/* Recent Riders */}
              <div className="section-card rentals-card">
                <div className="section-header">
                  <h2 className="section-title"><Activity size={24} />Today's Rides</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab('riders')}>
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="rentals-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Cycle</th>
                        <th>Start Time</th>
                        <th>Status</th>
                        <th>Deposit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysRiders.slice(0, 5).map((rider) => {
                        const dep = getDepositBadge(rider.depositStatus);
                        return (
                          <tr key={rider.transactionId}>
                            <td className="customer-cell">{rider.customerName}</td>
                            <td className="cycle-cell">{rider.cycleName}</td>
                            <td className="time-cell">
                              {rider.rentalStartTime
                                ? new Date(rider.rentalStartTime).toLocaleTimeString('en-IN', {
                                    hour: '2-digit', minute: '2-digit'
                                  })
                                : '--'}
                            </td>
                            <td>
                              <span className={`status-badge ${rider.rentalStatus?.toLowerCase()}`}>
                                {rider.rentalStatus}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                padding: '0.3rem 0.7rem', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: 600,
                                background: dep.bg, color: dep.color
                              }}>
                                {dep.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {todaysRiders.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                            No rides today yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="right-column">
              {/* Cycle Status Overview */}
              <div className="section-card cycle-status-card">
                <div className="section-header">
                  <h2 className="section-title"><Bike size={24} />Cycle Status Overview</h2>
                </div>
                <div className="cycle-status-chart">
                  {cyclesStatus.map((item) => (
                    <div key={item.status} className="status-item">
                      <div className="status-info">
                        <div className="status-color" style={{ backgroundColor: item.color }}></div>
                        <span className="status-label">{item.status}</span>
                      </div>
                      <div className="status-stats">
                        <span className="status-count">{item.count}</span>
                        <span className="status-percentage">{item.percentage}%</span>
                      </div>
                      <div className="status-bar">
                        <div className="status-bar-fill" style={{
                          width: `${item.percentage}%`, backgroundColor: item.color
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="section-card quick-actions-card">
                <div className="section-header">
                  <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
                  <button className="action-btn" onClick={() => setActiveTab('approvals')}>
                    <ClipboardCheck size={20} />
                    <span>Approvals {pendingApprovals.length > 0 && `(${pendingApprovals.length})`}</span>
                  </button>
                  <button className="action-btn" onClick={() => setShowDefectModal(true)}>
                    <Wrench size={20} />
                    <span>Report Defect</span>
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('riders')}>
                    <Users size={20} />
                    <span>Today's Riders</span>
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('cycles')}>
                    <Bike size={20} />
                    <span>Cycle Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Approvals Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'approvals' && (
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title"><ClipboardCheck size={24} />Pending Approvals</h2>
            <span className="task-count">{pendingApprovals.length} Pending</span>
          </div>
          {pendingApprovals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckCircle size={48} style={{ marginBottom: '1rem', color: '#10b981' }} />
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingApprovals.map((approval) => (
                <div key={approval.transactionId} style={{
                  background: '#f8fafc', borderRadius: '14px', padding: '1.5rem',
                  border: '1px solid #e2e8f0', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', color: '#1a202c', fontWeight: 700 }}>
                      {approval.customerName}
                    </h4>
                    <p style={{ margin: '0 0 0.3rem', color: '#64748b', fontSize: '0.9rem' }}>
                      📞 {approval.customerPhone}
                    </p>
                    <p style={{ margin: '0 0 0.3rem', color: '#64748b', fontSize: '0.9rem' }}>
                      🚲 {approval.cycleName} — {approval.cycleType}
                    </p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                      💳 Payment: <strong>{approval.paymentStatus}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleApproval(approval.transactionId, 'Approved')}
                      style={{
                        background: '#10b981', color: 'white', border: 'none',
                        borderRadius: '10px', padding: '0.8rem 1.5rem', cursor: 'pointer',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <ThumbsUp size={18} /> Approve
                    </button>
                    <button
                      onClick={() => handleApproval(approval.transactionId, 'Rejected')}
                      style={{
                        background: '#ef4444', color: 'white', border: 'none',
                        borderRadius: '10px', padding: '0.8rem 1.5rem', cursor: 'pointer',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <ThumbsDown size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Riders Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'riders' && (
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title"><Users size={24} />Today's Riders</h2>
            <span className="task-count">{todaysRiders.length} Total</span>
          </div>
          <div className="rentals-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Cycle</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Deposit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaysRiders.map((rider) => {
                  const dep = getDepositBadge(rider.depositStatus);
                  return (
                    <tr key={rider.transactionId}>
                      <td className="customer-cell">{rider.customerName}</td>
                      <td>{rider.customerPhone}</td>
                      <td className="cycle-cell">{rider.cycleName}</td>
                      <td className="time-cell">
                        {rider.rentalStartTime
                          ? new Date(rider.rentalStartTime).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit'
                            })
                          : '--'}
                      </td>
                      <td className="time-cell">
                        {rider.rentalEndTime
                          ? new Date(rider.rentalEndTime).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit'
                            })
                          : '--'}
                      </td>
                      <td>
                        <span className={`status-badge ${rider.rentalStatus?.toLowerCase()}`}>
                          {rider.rentalStatus}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.3rem 0.7rem', borderRadius: '20px',
                          fontSize: '0.8rem', fontWeight: 600,
                          background: dep.bg, color: dep.color
                        }}>
                          {dep.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {rider.depositStatus === 'NOT_PAID' && (
                            <button
                              onClick={() => handleCollectDeposit(rider.transactionId)}
                              style={{
                                background: '#667eea', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '0.4rem 0.8rem',
                                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                              }}
                            >
                              Collect
                            </button>
                          )}
                          {rider.depositStatus === 'COLLECTED' && (
                            <button
                              onClick={() => handleReturnDeposit(rider.transactionId)}
                              style={{
                                background: '#10b981', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '0.4rem 0.8rem',
                                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                              }}
                            >
                              Return
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {todaysRiders.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                      No riders today yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Cycles Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'cycles' && (
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title"><Bike size={24} />Cycle Conditions at Station</h2>
            <button
              className="view-all-btn"
              onClick={() => setShowDefectModal(true)}
            >
              + Report Defect
            </button>
          </div>
          {cycleConditions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckCircle size={48} style={{ marginBottom: '1rem', color: '#10b981' }} />
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>All cycles are in good condition!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cycleConditions.map((cycle, idx) => (
                <div key={idx} style={{
                  background: '#fef9f0', borderRadius: '14px', padding: '1.5rem',
                  border: '1px solid #fed7aa', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', color: '#1a202c', fontWeight: 700 }}>
                      Cycle #{cycle.cycleId}
                    </h4>
                    <p style={{ margin: '0 0 0.3rem', color: '#64748b', fontSize: '0.9rem' }}>
                      📝 {cycle.conditionNote}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem',
                    background: cycle.conditionStatus === 'Critical' ? '#fee2e2' :
                      cycle.conditionStatus === 'Major_Issue' ? '#fef3c7' : '#dbeafe',
                    color: cycle.conditionStatus === 'Critical' ? '#dc2626' :
                      cycle.conditionStatus === 'Major_Issue' ? '#d97706' : '#2563eb',
                  }}>
                    {cycle.conditionStatus?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Defect Report Modal ─────────────────────────────────────────────── */}
      {showDefectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '2rem',
            width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem', color: '#1a202c', fontSize: '1.3rem', fontWeight: 700 }}>
              🔧 Report Cycle Defect
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Cycle ID"
                value={defectForm.cycleId}
                onChange={(e) => setDefectForm({ ...defectForm, cycleId: e.target.value })}
                style={{
                  padding: '0.8rem 1rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <textarea
                placeholder="Describe the defect..."
                value={defectForm.conditionNote}
                onChange={(e) => setDefectForm({ ...defectForm, conditionNote: e.target.value })}
                rows={3}
                style={{
                  padding: '0.8rem 1rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', fontSize: '0.95rem',
                  outline: 'none', resize: 'vertical'
                }}
              />
              <select
                value={defectForm.conditionStatus}
                onChange={(e) => setDefectForm({ ...defectForm, conditionStatus: e.target.value })}
                style={{
                  padding: '0.8rem 1rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none'
                }}
              >
                <option value="Minor_Issue">Minor Issue</option>
                <option value="Major_Issue">Major Issue</option>
                <option value="Critical">Critical</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleReportDefect}
                  style={{
                    flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    padding: '0.9rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
                  }}
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setShowDefectModal(false)}
                  style={{
                    flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none',
                    borderRadius: '10px', padding: '0.9rem', fontWeight: 700,
                    fontSize: '1rem', cursor: 'pointer'
                  }}
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