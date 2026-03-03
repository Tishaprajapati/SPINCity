import React, { useState, useEffect } from 'react';
import adminDashboardService from '../../services/adminDashboardService';
import '../../style/admin/admindashboard2.css';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

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

      const summary = await adminDashboardService.getDashboardSummary();
      setDashboardData(summary);

      const rentals = await adminDashboardService.getRecentRentals();
      setRecentRentals(rentals);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatRentalTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
        <div className={`admin-dashboard-content ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>
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
        <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
        <div className={`admin-dashboard-content ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>
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

  const stats = [
    { 
      id: 1, 
      title: 'Total Customers', 
      value: dashboardData?.totalCustomers?.toLocaleString() || '0', 
      change: '+12%', 
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    { 
      id: 2, 
      title: 'Active Cycles', 
      value: dashboardData?.activeCycles?.toLocaleString() || '0', 
      change: '+8%', 
      changeType: 'positive',
      icon: '🚴',
      color: 'green'
    },
    { 
      id: 3, 
      title: "Today's Revenue", 
      value: `₹${dashboardData?.todayRevenue?.toLocaleString() || '0'}`, 
      change: '+23%', 
      changeType: 'positive',
      icon: '💰',
      color: 'purple'
    },
    { 
      id: 4, 
      title: 'Active Stations', 
      value: dashboardData?.activeStations?.toLocaleString() || '0', 
      change: `+${dashboardData?.activeStations || 0}`, 
      changeType: 'positive',
      icon: '📍',
      color: 'orange'
    },
  ];

  const alerts = [
    { id: 1, type: 'critical', message: 'Low cycle availability - Only 5 cycles left', time: '10 mins ago' },
    { id: 2, type: 'warning', message: 'Cycle #CP123 reported damaged by customer', time: '25 mins ago' },
    { id: 3, type: 'info', message: 'Inventory restock scheduled for tomorrow', time: '1 hour ago' },
  ];

  const topStations = [
    { station: 'CG Road', rentals: 145, revenue: 8450, rating: 4.8, trend: 'up' },
    { station: 'Vastrapur', rentals: 128, revenue: 7200, rating: 4.6, trend: 'up' },
    { station: 'Maninagar', rentals: 112, revenue: 6890, rating: 4.7, trend: 'down' },
    { station: 'Satellite', rentals: 98, revenue: 5640, rating: 4.5, trend: 'up' },
  ];

  const cycleOverview = [
    { 
      status: 'Available', 
      count: dashboardData?.activeCycles || 0, 
      total: (dashboardData?.activeCycles || 0) + (dashboardData?.inactiveCycles || 0), 
      percentage: dashboardData?.activeCycles && dashboardData?.inactiveCycles 
        ? Math.round((dashboardData.activeCycles / (dashboardData.activeCycles + dashboardData.inactiveCycles)) * 100)
        : 0,
      color: '#10b981' 
    },
    { 
      status: 'Rented', 
      count: 15, 
      total: 50, 
      percentage: 30, 
      color: '#6366f1' 
    },
    { 
      status: 'Maintenance', 
      count: dashboardData?.inactiveCycles || 0, 
      total: (dashboardData?.activeCycles || 0) + (dashboardData?.inactiveCycles || 0),
      percentage: dashboardData?.activeCycles && dashboardData?.inactiveCycles 
        ? Math.round((dashboardData.inactiveCycles / (dashboardData.activeCycles + dashboardData.inactiveCycles)) * 100)
        : 0,
      color: '#f59e0b' 
    },
  ];

  return (
    <div className="admin-layout">
      <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
      
      <div className={`admin-dashboard-content ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <h1 className="welcome-text">Welcome, <span className="admin-name">Admin</span></h1>
              <p className="admin-role">System Administrator</p>
            </div>
          </div>

          <div className="header-info-cards">
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-content">
                <p className="info-label">TOTAL STATIONS</p>
                <h3 className="info-value">
                  {dashboardData?.activeStations || 0} Active
                </h3>
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
                  <span className={`stat-change ${stat.changeType}`}>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          <div className="content-card recent-rentals">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">📊</span>
                <h2>Recent Rentals</h2>
              </div>
              <button className="view-all-btn">
                View All <span className="arrow">→</span>
              </button>
            </div>

            <div className="rentals-table">
              <div className="table-header">
                <span>CUSTOMER</span>
                <span>CYCLE</span>
                <span>START TIME</span>
                <span>DURATION</span>
                <span>STATUS</span>
              </div>
              {recentRentals.length > 0 ? (
                recentRentals.map((rental) => (
                  <div key={rental.rentalId} className="table-row">
                    <span className="customer-name">{rental.customerName}</span>
                    <span className="cycle-id">{rental.cycleName}</span>
                    <span className="start-time">{formatRentalTime(rental.startTime)}</span>
                    <span className="duration">
                      {calculateDuration(rental.startTime, rental.endTime)}
                    </span>
                    <span className={`status-badge ${rental.status.toLowerCase()}`}>
                      {rental.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="no-data">No recent rentals found</div>
              )}
            </div>
          </div>

          <div className="content-card alerts-card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">🔔</span>
                <h2>Alerts & Notifications</h2>
              </div>
              <span className="alert-count">{alerts.length}</span>
            </div>

            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                  <div className="alert-indicator"></div>
                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          <div className="content-card stations-card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">🏆</span>
                <h2>Top Performing Stations</h2>
              </div>
            </div>

            <div className="stations-table">
              <div className="table-header">
                <span>STATION</span>
                <span>RENTALS</span>
                <span>REVENUE</span>
                <span>RATING</span>
              </div>
              {topStations.map((station, index) => (
                <div key={index} className="table-row">
                  <span className="station-name">
                    <span className="station-rank">#{index + 1}</span>
                    {station.station}
                  </span>
                  <span className="rentals-count">{station.rentals}</span>
                  <span className="revenue-amount">₹{station.revenue.toLocaleString()}</span>
                  <span className="rating-badge">⭐ {station.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card cycle-overview">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon">🚲</span>
                <h2>Cycle Status Overview</h2>
              </div>
            </div>

            <div className="cycle-stats">
              {cycleOverview.map((item, index) => (
                <div key={index} className="cycle-stat-item">
                  <div className="cycle-stat-header">
                    <div className="cycle-stat-color" style={{ backgroundColor: item.color }}></div>
                    <span className="cycle-stat-label">{item.status}</span>
                    <span className="cycle-stat-count">{item.count}</span>
                    <span className="cycle-stat-percentage">{item.percentage}%</span>
                  </div>
                  <div className="cycle-stat-bar">
                    <div 
                      className="cycle-stat-fill" 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <span>🚴</span>
                  Check-in Cycle
                </button>
                <button className="action-btn">
                  <span>🔧</span>
                  Log Maintenance
                </button>
                <button className="action-btn">
                  <span>📦</span>
                  Update Inventory
                </button>
                <button className="action-btn">
                  <span>🔄</span>
                  Redistribute
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