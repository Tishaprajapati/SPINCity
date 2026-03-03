import React, { useState } from 'react';
import '../../style/employee/maintanencelogging.css';

const MaintenenceLogging = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    cycleId: '',
    maintenanceType: 'Routine',
    priority: 'Normal',
    description: '',
    partsReplaced: '',
    cost: '',
    performedBy: 'Current Employee',
    nextMaintenanceDue: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const maintenanceHistory = [
    {
      id: 1,
      cycleId: 'SPIN-CB-001',
      cycleName: 'Urban Commuter Pro',
      type: 'Repair',
      priority: 'High',
      date: '2024-06-15',
      description: 'Brake system repair - brake pads worn out',
      cost: 300,
      partsReplaced: 'Brake Pads, Brake Cable',
      performedBy: 'Rahul Verma',
      status: 'Completed',
      nextDue: '2024-09-15'
    },
    {
      id: 2,
      cycleId: 'SPIN-EB-004',
      cycleName: 'Electric Power',
      type: 'Routine',
      priority: 'Normal',
      date: '2024-06-10',
      description: 'Regular maintenance - chain lubrication and tire check',
      cost: 150,
      partsReplaced: 'None',
      performedBy: 'Divya Sharma',
      status: 'Completed',
      nextDue: '2024-07-10'
    },
    {
      id: 3,
      cycleId: 'SPIN-MB-002',
      cycleName: 'Mountain Explorer X1',
      type: 'Emergency',
      priority: 'Critical',
      date: '2024-06-08',
      description: 'Flat tire and chain broken during ride',
      cost: 500,
      partsReplaced: 'Tire Tube, Chain, Brake Pads',
      performedBy: 'Rahul Verma',
      status: 'Completed',
      nextDue: '2024-09-08'
    },
    {
      id: 4,
      cycleId: 'SPIN-CB-003',
      cycleName: 'City Rider Deluxe',
      type: 'Inspection',
      priority: 'Low',
      date: '2024-06-05',
      description: 'Safety inspection after 200 rides',
      cost: 100,
      partsReplaced: 'None',
      performedBy: 'Divya Sharma',
      status: 'Completed',
      nextDue: '2024-09-05'
    }
  ];

  const [pendingMaintenance] = useState([
    {
      cycleId: 'SPIN-CB-009',
      cycleName: 'City Explorer',
      dueDate: '2024-06-18',
      lastMaintenance: '2024-03-18',
      totalRides: 215,
      priority: 'High',
      reason: 'Due for routine maintenance (200+ rides)'
    },
    {
      cycleId: 'SPIN-EB-010',
      cycleName: 'E-Mountain King',
      dueDate: '2024-06-20',
      lastMaintenance: '2024-03-20',
      totalRides: 189,
      priority: 'Normal',
      reason: '3 months since last service'
    },
    {
      cycleId: 'SPIN-MB-006',
      cycleName: 'Trail Blazer Pro',
      dueDate: '2024-06-16',
      lastMaintenance: '2024-06-01',
      totalRides: 267,
      priority: 'Critical',
      reason: 'Currently under maintenance'
    }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Maintenance record:', formData);
    alert('Maintenance record added successfully!');
    setFormData({
      cycleId: '',
      maintenanceType: 'Routine',
      priority: 'Normal',
      description: '',
      partsReplaced: '',
      cost: '',
      performedBy: 'Current Employee',
      nextMaintenanceDue: ''
    });
    setSelectedImage(null);
    setShowAddForm(false);
  };

  const getPriorityClass = (priority) => {
    const classes = {
      'Critical': 'priority-critical',
      'High': 'priority-high',
      'Normal': 'priority-normal',
      'Low': 'priority-low'
    };
    return classes[priority] || 'priority-normal';
  };

  const getStatusClass = (status) => {
    const classes = {
      'Completed': 'status-completed',
      'In Progress': 'status-progress',
      'Pending': 'status-pending'
    };
    return classes[status] || 'status-pending';
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <h1>🔧 Maintenance Logging</h1>
              <p>Manage cycle maintenance records and schedules</p>
            </div>
            <button 
              className="btn-add-maintenance"
              onClick={() => setShowAddForm(true)}
            >
              + Add Maintenance
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">12</div>
              <div className="stat-label">Completed Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">3</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <div className="stat-value">1</div>
              <div className="stat-label">Critical Priority</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-value">₹1,050</div>
              <div className="stat-label">Total Cost Today</div>
            </div>
          </div>
        </div>

        <div className="maintenance-tabs">
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Record
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏰ Due for Maintenance
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            📅 Schedule
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'add' && (
            <div className="add-maintenance-section animate-fade-in">
              {!showAddForm ? (
                <div className="empty-state">
                  <div className="empty-icon">🔧</div>
                  <h3>Add New Maintenance Record</h3>
                  <p>Click the button above to log a new maintenance activity</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add Maintenance Record
                  </button>
                </div>
              ) : (
                <div className="maintenance-form-card">
                  <div className="form-header">
                    <h3>New Maintenance Record</h3>
                    <button 
                      className="btn-close"
                      onClick={() => setShowAddForm(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="form-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Cycle ID / QR Code</label>
                        <div className="input-with-icon">
                          <input 
                            type="text" 
                            name="cycleId"
                            value={formData.cycleId}
                            onChange={handleInputChange}
                            placeholder="Enter or scan cycle ID"
                            className="form-input"
                          />
                          <button type="button" className="btn-scan">📷 Scan</button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Maintenance Type</label>
                        <select 
                          name="maintenanceType"
                          value={formData.maintenanceType}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="Routine">Routine</option>
                          <option value="Repair">Repair</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Inspection">Inspection</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority Level</label>
                        <select 
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="Low">Low</option>
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Cost (₹)</label>
                        <input 
                          type="number" 
                          name="cost"
                          value={formData.cost}
                          onChange={handleInputChange}
                          placeholder="Enter maintenance cost"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Description</label>
                        <textarea 
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the maintenance work performed..."
                          rows="3"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Parts Replaced</label>
                        <input 
                          type="text" 
                          name="partsReplaced"
                          value={formData.partsReplaced}
                          onChange={handleInputChange}
                          placeholder="e.g., Brake Pads, Chain, Tire Tube (or 'None')"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Next Maintenance Due</label>
                        <input 
                          type="date" 
                          name="nextMaintenanceDue"
                          value={formData.nextMaintenanceDue}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Upload Photo (Optional)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="form-input-file"
                        />
                        {selectedImage && (
                          <div className="image-preview">
                            <img src={selectedImage} alt="Preview" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        className="btn-submit"
                        onClick={handleSubmit}
                      >
                        Save Maintenance Record
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section animate-fade-in">
              <div className="section-header">
                <h3>Maintenance History</h3>
                <div className="filter-group">
                  <select className="filter-select">
                    <option>All Types</option>
                    <option>Routine</option>
                    <option>Repair</option>
                    <option>Emergency</option>
                    <option>Inspection</option>
                  </select>
                  <input type="date" className="filter-date" />
                </div>
              </div>

              <div className="history-list">
                {maintenanceHistory.map((record) => (
                  <div key={record.id} className="history-card">
                    <div className="history-header">
                      <div className="history-title">
                        <h4>{record.cycleName}</h4>
                        <span className="cycle-id">{record.cycleId}</span>
                      </div>
                      <div className="history-badges">
                        <span className={`badge ${getPriorityClass(record.priority)}`}>
                          {record.priority}
                        </span>
                        <span className={`badge ${getStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </div>

                    <div className="history-body">
                      <div className="history-detail">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{record.type}</span>
                      </div>
                      <div className="history-detail">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="history-detail full-width">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{record.description}</span>
                      </div>
                      <div className="history-detail">
                        <span className="detail-label">Parts Replaced:</span>
                        <span className="detail-value">{record.partsReplaced}</span>
                      </div>
                      <div className="history-detail">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value cost">₹{record.cost}</span>
                      </div>
                      <div className="history-detail">
                        <span className="detail-label">Performed By:</span>
                        <span className="detail-value">{record.performedBy}</span>
                      </div>
                      <div className="history-detail">
                        <span className="detail-label">Next Due:</span>
                        <span className="detail-value">{new Date(record.nextDue).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="history-actions">
                      <button className="btn-view">View Details</button>
                      <button className="btn-download">📥 Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="pending-section animate-fade-in">
              <div className="section-header">
                <h3>Cycles Due for Maintenance</h3>
                <span className="count-badge">{pendingMaintenance.length} cycles</span>
              </div>

              <div className="pending-list">
                {pendingMaintenance.map((cycle, index) => (
                  <div key={index} className="pending-card">
                    <div className="pending-header">
                      <div className={`priority-indicator ${getPriorityClass(cycle.priority)}`}></div>
                      <div className="pending-info">
                        <h4>{cycle.cycleName}</h4>
                        <span className="cycle-id">{cycle.cycleId}</span>
                      </div>
                      <span className={`badge ${getPriorityClass(cycle.priority)}`}>
                        {cycle.priority}
                      </span>
                    </div>

                    <div className="pending-body">
                      <div className="pending-detail">
                        <span className="detail-icon">📅</span>
                        <div>
                          <div className="detail-label">Due Date</div>
                          <div className="detail-value">{new Date(cycle.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="pending-detail">
                        <span className="detail-icon">🔧</span>
                        <div>
                          <div className="detail-label">Last Maintenance</div>
                          <div className="detail-value">{new Date(cycle.lastMaintenance).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="pending-detail">
                        <span className="detail-icon">🚴</span>
                        <div>
                          <div className="detail-label">Total Rides</div>
                          <div className="detail-value">{cycle.totalRides} rides</div>
                        </div>
                      </div>
                      <div className="pending-detail full-width">
                        <span className="detail-icon">💡</span>
                        <div>
                          <div className="detail-label">Reason</div>
                          <div className="detail-value">{cycle.reason}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pending-actions">
                      <button 
                        className="btn-schedule"
                        onClick={() => {
                          setFormData({ ...formData, cycleId: cycle.cycleId });
                          setActiveTab('add');
                          setShowAddForm(true);
                        }}
                      >
                        Schedule Maintenance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-section animate-fade-in">
              <div className="section-header">
                <h3>Maintenance Schedule</h3>
                <select className="filter-select">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Next Month</option>
                </select>
              </div>

              <div className="calendar-view">
                <div className="calendar-placeholder">
                  <div className="calendar-icon">📅</div>
                  <h3>Maintenance Calendar</h3>
                  <p>View scheduled maintenance tasks by date</p>
                  <p className="upcoming-count">3 maintenance tasks upcoming this week</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenenceLogging;