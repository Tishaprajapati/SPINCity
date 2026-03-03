import React, { useState } from 'react';
import '../../style/admin/employeemanagement.css';

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock employee data
  const allEmployees = [
    {
      employee_id: 'EMP001',
      employee_name: 'Rajesh Kumar',
      employee_contact: '+91 98765 43210',
      employee_email: 'rajesh.kumar@spincity.com',
      assigned_station: 'Central Park Station',
      station_id: 'STN001',
      designation: 'Station Manager',
      joining_date: '2024-01-15',
      salary: 45000,
      shift_timing: '09:00 AM - 06:00 PM',
      rating: 4.8,
      status: 'active',
      total_tasks: 245,
      completed_tasks: 232,
      pending_tasks: 13
    },
    {
      employee_id: 'EMP002',
      employee_name: 'Priya Patel',
      employee_contact: '+91 98765 43211',
      employee_email: 'priya.patel@spincity.com',
      assigned_station: 'Beach View Station',
      station_id: 'STN002',
      designation: 'Station Manager',
      joining_date: '2024-02-10',
      salary: 45000,
      shift_timing: '09:00 AM - 06:00 PM',
      rating: 4.6,
      status: 'active',
      total_tasks: 189,
      completed_tasks: 178,
      pending_tasks: 11
    },
    {
      employee_id: 'EMP003',
      employee_name: 'Amit Sharma',
      employee_contact: '+91 98765 43212',
      employee_email: 'amit.sharma@spincity.com',
      assigned_station: 'Mall Road Station',
      station_id: 'STN003',
      designation: 'Station Manager',
      joining_date: '2023-11-20',
      salary: 45000,
      shift_timing: '09:00 AM - 06:00 PM',
      rating: 4.7,
      status: 'active',
      total_tasks: 312,
      completed_tasks: 298,
      pending_tasks: 14
    },
    {
      employee_id: 'EMP004',
      employee_name: 'Sneha Mehta',
      employee_contact: '+91 98765 43213',
      employee_email: 'sneha.mehta@spincity.com',
      assigned_station: 'University Station',
      station_id: 'STN004',
      designation: 'Station Manager',
      joining_date: '2024-03-05',
      salary: 45000,
      shift_timing: '09:00 AM - 06:00 PM',
      rating: 4.5,
      status: 'on-leave',
      total_tasks: 156,
      completed_tasks: 145,
      pending_tasks: 11
    },
    {
      employee_id: 'EMP005',
      employee_name: 'Rahul Singh',
      employee_contact: '+91 98765 43214',
      employee_email: 'rahul.singh@spincity.com',
      assigned_station: 'Tech Park Station',
      station_id: 'STN005',
      designation: 'Station Manager',
      joining_date: '2023-08-12',
      salary: 45000,
      shift_timing: '09:00 AM - 06:00 PM',
      rating: 4.9,
      status: 'active',
      total_tasks: 423,
      completed_tasks: 410,
      pending_tasks: 13
    },
    {
      employee_id: 'EMP006',
      employee_name: 'Vikram Shah',
      employee_contact: '+91 98765 43215',
      employee_email: 'vikram.shah@spincity.com',
      assigned_station: 'Central Park Station',
      station_id: 'STN001',
      designation: 'Maintenance Technician',
      joining_date: '2024-01-20',
      salary: 32000,
      shift_timing: '10:00 AM - 07:00 PM',
      rating: 4.4,
      status: 'active',
      total_tasks: 178,
      completed_tasks: 165,
      pending_tasks: 13
    },
    {
      employee_id: 'EMP007',
      employee_name: 'Kavita Desai',
      employee_contact: '+91 98765 43216',
      employee_email: 'kavita.desai@spincity.com',
      assigned_station: 'Beach View Station',
      station_id: 'STN002',
      designation: 'Customer Support',
      joining_date: '2024-04-01',
      salary: 28000,
      shift_timing: '08:00 AM - 05:00 PM',
      rating: 4.7,
      status: 'active',
      total_tasks: 234,
      completed_tasks: 220,
      pending_tasks: 14
    },
    {
      employee_id: 'EMP008',
      employee_name: 'Neha Gupta',
      employee_contact: '+91 98765 43217',
      employee_email: 'neha.gupta@spincity.com',
      assigned_station: 'Mall Road Station',
      station_id: 'STN003',
      designation: 'Maintenance Technician',
      joining_date: '2023-12-10',
      salary: 32000,
      shift_timing: '10:00 AM - 07:00 PM',
      rating: 4.6,
      status: 'active',
      total_tasks: 201,
      completed_tasks: 189,
      pending_tasks: 12
    }
  ];

  // Calculate statistics
  const stats = {
    totalEmployees: allEmployees.length,
    activeEmployees: allEmployees.filter(e => e.status === 'active').length,
    onLeave: allEmployees.filter(e => e.status === 'on-leave').length,
    avgRating: (allEmployees.reduce((sum, e) => sum + e.rating, 0) / allEmployees.length).toFixed(1),
    totalSalary: allEmployees.reduce((sum, e) => sum + e.salary, 0),
    stationManagers: allEmployees.filter(e => e.designation === 'Station Manager').length,
    technicians: allEmployees.filter(e => e.designation === 'Maintenance Technician').length,
    support: allEmployees.filter(e => e.designation === 'Customer Support').length
  };

  // Filter employees
  const filteredEmployees = allEmployees.filter(employee => {
    const matchesSearch = employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.employee_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesignation = filterDesignation === 'all' || employee.designation === filterDesignation;
    const matchesStation = filterStation === 'all' || employee.station_id === filterStation;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesDesignation && matchesStation && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'on-leave': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="employee-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <span className="title-icon">👥</span>
              Employee Management
            </h1>
            <p className="page-subtitle">Manage your workforce and track employee performance</p>
          </div>
          <div className="header-actions">
            <button className="add-employee-btn" onClick={() => setShowAddEmployee(true)}>
              <span>➕</span>
              Add Employee
            </button>
            <button className="export-btn">
              <span>📥</span>
              Export Data
            </button>
          </div>
        </div>

        
      </div>
      {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-label">Total Employees</span>
              <span className="stat-value">{stats.totalEmployees}</span>
              <span className="stat-detail">Across all stations</span>
            </div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Active</span>
              <span className="stat-value">{stats.activeEmployees}</span>
              <span className="stat-detail">{Math.round((stats.activeEmployees/stats.totalEmployees)*100)}% workforce</span>
            </div>
          </div>

          <div className="stat-card leave">
            <div className="stat-icon">🏖️</div>
            <div className="stat-content">
              <span className="stat-label">On Leave</span>
              <span className="stat-value">{stats.onLeave}</span>
              <span className="stat-detail">Currently unavailable</span>
            </div>
          </div>

          <div className="stat-card rating">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-label">Avg Rating</span>
              <span className="stat-value">{stats.avgRating}</span>
              <span className="stat-detail">Employee performance</span>
            </div>
          </div>

          <div className="stat-card salary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Monthly Payroll</span>
              <span className="stat-value">₹{(stats.totalSalary/1000).toFixed(0)}K</span>
              <span className="stat-detail">Total expenses</span>
            </div>
          </div>

          <div className="stat-card designation">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-label">Designations</span>
              <span className="stat-value">{stats.stationManagers}/{stats.technicians}/{stats.support}</span>
              <span className="stat-detail">Manager/Tech/Support</span>
            </div>
          </div>
        </div>

      {/* Controls Section */}
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
              <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="filter-controls">
            <select value={filterDesignation} onChange={(e) => setFilterDesignation(e.target.value)}>
              <option value="all">All Designations</option>
              <option value="Station Manager">Station Manager</option>
              <option value="Maintenance Technician">Maintenance Technician</option>
              <option value="Customer Support">Customer Support</option>
            </select>

            <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)}>
              <option value="all">All Stations</option>
              <option value="STN001">Central Park Station</option>
              <option value="STN002">Beach View Station</option>
              <option value="STN003">Mall Road Station</option>
              <option value="STN004">University Station</option>
              <option value="STN005">Tech Park Station</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredEmployees.length} of {allEmployees.length} employees
        </div>
      </div>

      {/* Employees Display */}
      {viewMode === 'grid' ? (
        <div className="employees-grid">
          {filteredEmployees.map((employee, index) => (
            <div 
              key={employee.employee_id} 
              className="employee-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-header">
                <div className="employee-avatar">
                  {employee.employee_name.split(' ').map(n => n[0]).join('')}
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                >
                  {employee.status}
                </span>
              </div>

              <div className="employee-info">
                <h3 className="employee-name">{employee.employee_name}</h3>
                <p className="employee-id">{employee.employee_id}</p>
                
                <div className="designation-tag">
                  <span className="badge">{employee.designation}</span>
                </div>

                <div className="employee-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{employee.assigned_station}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span className="detail-text">{employee.employee_email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <span className="detail-text">{employee.employee_contact}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-text">{employee.shift_timing}</span>
                  </div>
                </div>

                <div className="employee-metrics">
                  <div className="metric">
                    <span className="metric-value">{employee.total_tasks}</span>
                    <span className="metric-label">Total Tasks</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{employee.completed_tasks}</span>
                    <span className="metric-label">Completed</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">⭐ {employee.rating}</span>
                    <span className="metric-label">Rating</span>
                  </div>
                </div>

                <div className="salary-info">
                  <span className="salary-label">Monthly Salary:</span>
                  <span className="salary-value">₹{employee.salary.toLocaleString()}</span>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="view-details-btn"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowEmployeeDetails(true);
                  }}
                >
                  View Details →
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
                <th>Contact</th>
                <th>Shift</th>
                <th>Rating</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>
                    <div className="table-employee-info">
                      <div className="table-avatar">
                        {employee.employee_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <strong>{employee.employee_name}</strong>
                        <span className="table-employee-id">{employee.employee_id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-designation-badge">{employee.designation}</span>
                  </td>
                  <td>{employee.assigned_station}</td>
                  <td>
                    <div className="table-contact">
                      <span>{employee.employee_contact}</span>
                      <span className="table-email">{employee.employee_email}</span>
                    </div>
                  </td>
                  <td>{employee.shift_timing}</td>
                  <td className="rating-cell">⭐ {employee.rating}</td>
                  <td className="salary-cell">₹{employee.salary.toLocaleString()}</td>
                  <td>
                    <span 
                      className="table-status-badge"
                      style={{ backgroundColor: getStatusColor(employee.status) }}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="table-view-btn"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowEmployeeDetails(true);
                      }}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowEmployeeDetails(false)}>
          <div className="modal-content employee-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEmployeeDetails(false)}>✕</button>
            
            <div className="modal-header-employee">
              <div className="modal-employee-avatar-large">
                {selectedEmployee.employee_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="modal-employee-title">
                <h2>{selectedEmployee.employee_name}</h2>
                <span className="modal-employee-id">{selectedEmployee.employee_id}</span>
                <span className="modal-designation">{selectedEmployee.designation}</span>
              </div>
              <span 
                className="modal-status-badge"
                style={{ backgroundColor: getStatusColor(selectedEmployee.status) }}
              >
                {selectedEmployee.status}
              </span>
            </div>

            <div className="modal-body-employee">
              <div className="employee-details-grid">
                <div className="detail-section">
                  <h3>👤 Personal Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Employee ID:</span>
                    <span className="detail-value">{selectedEmployee.employee_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{selectedEmployee.employee_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedEmployee.employee_email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{selectedEmployee.employee_contact}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💼 Work Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Designation:</span>
                    <span className="detail-value">{selectedEmployee.designation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Assigned Station:</span>
                    <span className="detail-value">{selectedEmployee.assigned_station}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Shift Timing:</span>
                    <span className="detail-value">{selectedEmployee.shift_timing}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Joining Date:</span>
                    <span className="detail-value">{selectedEmployee.joining_date}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>📊 Performance</h3>
                  <div className="detail-row">
                    <span className="detail-label">Total Tasks:</span>
                    <span className="detail-value">{selectedEmployee.total_tasks}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value completed-text">{selectedEmployee.completed_tasks}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pending:</span>
                    <span className="detail-value pending-text">{selectedEmployee.pending_tasks}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rating:</span>
                    <span className="detail-value">⭐ {selectedEmployee.rating}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💰 Salary Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Monthly Salary:</span>
                    <span className="detail-value salary-highlight">₹{selectedEmployee.salary.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Annual Package:</span>
                    <span className="detail-value">₹{(selectedEmployee.salary * 12).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer-employee">
              <button className="footer-btn secondary" onClick={() => setShowEmployeeDetails(false)}>
                Close
              </button>
              <button className="footer-btn primary">
                ✏️ Edit Details
              </button>
              <button className="footer-btn action">
                📋 View Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="modal-overlay" onClick={() => setShowAddEmployee(false)}>
          <div className="modal-content add-employee-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddEmployee(false)}>✕</button>
            
            <div className="modal-header-simple">
              <h2>Add New Employee</h2>
            </div>

            <div className="modal-body-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter employee name" />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" placeholder="Auto-generated" disabled />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="employee@spincity.com" />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <select>
                    <option>Station Manager</option>
                    <option>Maintenance Technician</option>
                    <option>Customer Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Station</label>
                  <select>
                    <option>Central Park Station</option>
                    <option>Beach View Station</option>
                    <option>Mall Road Station</option>
                    <option>University Station</option>
                    <option>Tech Park Station</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monthly Salary</label>
                  <input type="number" placeholder="Enter salary amount" />
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input type="date" />
                </div>
                <div className="form-group full-width">
                  <label>Shift Timing</label>
                  <input type="text" placeholder="e.g., 09:00 AM - 06:00 PM" />
                </div>
              </div>
            </div>

            <div className="modal-footer-simple">
              <button className="footer-btn secondary" onClick={() => setShowAddEmployee(false)}>
                Cancel
              </button>
              <button className="footer-btn primary">
                ➕ Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;