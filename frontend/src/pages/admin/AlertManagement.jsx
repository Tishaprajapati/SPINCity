import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock, Filter, Search, Eye, AlertCircle, User, MapPin, Bike, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import '../../style/admin/AlertManagement.css';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    critical: 0
  });

  // Mock data generation - only 5 alerts
  useEffect(() => {
    const mockAlerts = [
      {
        alert_id: 'ALT0001',
        alert_type: 'Cycle Malfunction',
        cycle_id: 'CYC123',
        customer_id: 'CUST0456',
        customer_name: 'Raj Kumar',
        station_id: 'STN05',
        station_name: 'MG Road Station',
        alert_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        alert_status: 'Active',
        priority: 'High',
        description: 'Brake failure reported on cycle CYC123. Customer unable to stop properly.',
        assigned_to: 'Maintenance Team A',
        estimated_resolution: '2 hours'
      },
      {
        alert_id: 'ALT0002',
        alert_type: 'Low Battery',
        cycle_id: 'CYC087',
        customer_id: null,
        customer_name: null,
        station_id: 'STN12',
        station_name: 'Tech Park Station',
        alert_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        alert_status: 'In Progress',
        priority: 'Medium',
        description: 'E-cycle battery level below 15%. Requires immediate charging.',
        assigned_to: 'Station Staff',
        estimated_resolution: '1 hour'
      },
      {
        alert_id: 'ALT0003',
        alert_type: 'Station Overcrowding',
        cycle_id: null,
        customer_id: 'CUST0789',
        customer_name: 'Priya Sharma',
        station_id: 'STN03',
        station_name: 'Railway Station',
        alert_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        alert_status: 'Resolved',
        priority: 'Medium',
        description: 'Station reached maximum capacity. No parking slots available.',
        assigned_to: 'Redistribution Team',
        estimated_resolution: 'Completed'
      },
      {
        alert_id: 'ALT0004',
        alert_type: 'Payment Failure',
        cycle_id: 'CYC234',
        customer_id: 'CUST0912',
        customer_name: 'Amit Patel',
        station_id: 'STN08',
        station_name: 'City Mall Station',
        alert_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        alert_status: 'Active',
        priority: 'High',
        description: 'Multiple payment attempts failed. Transaction stuck in pending state.',
        assigned_to: 'Payment Support',
        estimated_resolution: '30 minutes'
      },
      {
        alert_id: 'ALT0005',
        alert_type: 'Theft Suspected',
        cycle_id: 'CYC456',
        customer_id: 'CUST0345',
        customer_name: 'Sneha Reddy',
        station_id: 'STN15',
        station_name: 'University Gate',
        alert_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        alert_status: 'Dismissed',
        priority: 'Critical',
        description: 'Cycle not returned within 24 hours. GPS shows unusual location pattern.',
        assigned_to: 'Security Team',
        estimated_resolution: 'Under Investigation'
      }
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    
    // Calculate stats
    const active = mockAlerts.filter(a => a.alert_status === 'Active').length;
    const resolved = mockAlerts.filter(a => a.alert_status === 'Resolved').length;
    const critical = mockAlerts.filter(a => a.priority === 'Critical' || a.priority === 'High').length;

    setStats({
      total: mockAlerts.length,
      active,
      resolved,
      critical
    });
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.alert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.customer_name && a.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.alert_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.alert_status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(a => a.priority === filterPriority);
    }

    setFilteredAlerts(filtered);
  }, [searchTerm, filterType, filterStatus, filterPriority, alerts]);

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(alert => 
      alert.alert_id === alertId ? { ...alert, alert_status: newStatus } : alert
    ));
    setSelectedAlert(null);
  };

  return (
    <div className="alert-container">
      <div className="alert-content">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">
            <Bell className="title-icon" size={40} />
            Alert Management System
          </h1>
          <p className="subtitle">Real-time monitoring and management of system alerts</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Alerts</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <BarChart3 className="stat-icon stat-icon-primary" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Active Alerts</p>
                <p className="stat-value stat-value-warning">{stats.active}</p>
              </div>
              <AlertTriangle className="stat-icon stat-icon-warning" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Resolved</p>
                <p className="stat-value stat-value-success">{stats.resolved}</p>
              </div>
              <CheckCircle className="stat-icon stat-icon-success" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Critical Issues</p>
                <p className="stat-value stat-value-danger">{stats.critical}</p>
              </div>
              <AlertCircle className="stat-icon stat-icon-danger" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filter-section">
          <div className="filter-controls">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search alerts by ID, type, customer, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-btn"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filter-dropdown">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Alert Types</option>
                <option value="Cycle Malfunction">Cycle Malfunction</option>
                <option value="Low Battery">Low Battery</option>
                <option value="Station Overcrowding">Station Overcrowding</option>
                <option value="Payment Failure">Payment Failure</option>
                <option value="Theft Suspected">Theft Suspected</option>
                <option value="Maintenance Required">Maintenance Required</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Alerts Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="alert-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Customer</th>
                  <th>Station</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.alert_id} className="table-row">
                    <td>
                      <span className="alert-id">{alert.alert_id}</span>
                    </td>
                    <td>
                      <div className="alert-type-cell">
                        <AlertTriangle size={16} className="alert-type-icon" />
                        <span>{alert.alert_type}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge priority-${alert.priority.toLowerCase()}`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td>
                      {alert.customer_name ? (
                        <div className="customer-info">
                          <User size={14} className="customer-icon" />
                          <div>
                            <p className="customer-name">{alert.customer_name}</p>
                            <p className="customer-id">{alert.customer_id}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="no-customer">System Alert</span>
                      )}
                    </td>
                    <td>
                      <div className="station-info">
                        <MapPin size={14} className="station-icon" />
                        <span>{alert.station_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge status-${alert.alert_status.toLowerCase().replace(' ', '-')}`}>
                        {alert.alert_status}
                      </span>
                    </td>
                    <td>
                      <div className="time-info">
                        <Clock size={14} className="time-icon" />
                        <span>{new Date(alert.alert_date).toLocaleString('en-IN', { 
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="action-btn"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAlerts.length === 0 && (
            <div className="no-data">
              <Bell size={48} className="no-data-icon" />
              <p>No alerts found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-section">
                  <h2 className="modal-title">Alert Details</h2>
                  <p className="modal-alert-id">{selectedAlert.alert_id}</p>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="modal-close">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="modal-body">
                {/* Alert Type and Priority */}
                <div className="detail-header-section">
                  <div className="detail-header-item">
                    <AlertTriangle size={20} className="detail-header-icon" />
                    <div>
                      <p className="detail-header-label">Alert Type</p>
                      <p className="detail-header-value">{selectedAlert.alert_type}</p>
                    </div>
                  </div>
                  <div className="detail-header-item">
                    <span className={`badge-large priority-${selectedAlert.priority.toLowerCase()}`}>
                      {selectedAlert.priority} Priority
                    </span>
                  </div>
                  <div className="detail-header-item">
                    <span className={`badge-large status-${selectedAlert.alert_status.toLowerCase().replace(' ', '-')}`}>
                      {selectedAlert.alert_status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <AlertCircle size={18} />
                    Alert Description
                  </h3>
                  <p className="alert-description">{selectedAlert.description}</p>
                </div>

                {/* Customer Info */}
                {selectedAlert.customer_name && (
                  <div className="detail-section">
                    <h3 className="detail-title">
                      <User size={18} />
                      Customer Information
                    </h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <p className="detail-label">Name</p>
                        <p className="detail-value">{selectedAlert.customer_name}</p>
                      </div>
                      <div className="detail-item">
                        <p className="detail-label">Customer ID</p>
                        <p className="detail-value detail-mono">{selectedAlert.customer_id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Asset Information */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <Bike size={18} />
                    Asset Information
                  </h3>
                  <div className="detail-grid">
                    {selectedAlert.cycle_id && (
                      <div className="detail-item">
                        <p className="detail-label">Cycle ID</p>
                        <p className="detail-value detail-mono">{selectedAlert.cycle_id}</p>
                      </div>
                    )}
                    <div className="detail-item">
                      <p className="detail-label">Station</p>
                      <p className="detail-value">{selectedAlert.station_name}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Station ID</p>
                      <p className="detail-value detail-mono">{selectedAlert.station_id}</p>
                    </div>
                  </div>
                </div>

                {/* Assignment and Timeline */}
                <div className="detail-grid-2">
                  <div className="detail-section">
                    <h3 className="detail-title">
                      <TrendingUp size={18} />
                      Assignment
                    </h3>
                    <p className="detail-value-box">{selectedAlert.assigned_to}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">
                      <Clock size={18} />
                      Est. Resolution
                    </h3>
                    <p className="detail-value-box">{selectedAlert.estimated_resolution}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <Calendar size={18} />
                    Alert Timeline
                  </h3>
                  <p className="detail-value">
                    Created: {new Date(selectedAlert.alert_date).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Action Buttons */}
                {selectedAlert.alert_status === 'Active' && (
                  <div className="action-buttons">
                    <button 
                      className="action-btn-primary action-btn-progress"
                      onClick={() => updateAlertStatus(selectedAlert.alert_id, 'In Progress')}
                    >
                      <Clock size={18} />
                      Mark In Progress
                    </button>
                    <button 
                      className="action-btn-primary action-btn-success"
                      onClick={() => updateAlertStatus(selectedAlert.alert_id, 'Resolved')}
                    >
                      <CheckCircle size={18} />
                      Mark as Resolved
                    </button>
                  </div>
                )}
                {selectedAlert.alert_status === 'In Progress' && (
                  <div className="action-buttons">
                    <button 
                      className="action-btn-primary action-btn-success"
                      onClick={() => updateAlertStatus(selectedAlert.alert_id, 'Resolved')}
                    >
                      <CheckCircle size={18} />
                      Mark as Resolved
                    </button>
                    <button 
                      className="action-btn-primary action-btn-danger"
                      onClick={() => updateAlertStatus(selectedAlert.alert_id, 'Dismissed')}
                    >
                      <XCircle size={18} />
                      Dismiss Alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertManagement;