import React, { useState } from 'react';
import '../../style/admin/customermanagement.css';

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - Replace with API calls
  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 9876543210',
      memberSince: 'Jan 2024',
      totalRides: 45,
      totalSpent: 1250,
      membership: 'Monthly Plan',
      membershipStatus: 'Active',
      status: 'verified',
      lastRide: '2 hours ago',
      avatar: 'RK',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 9876543211',
      memberSince: 'Dec 2023',
      totalRides: 78,
      totalSpent: 2890,
      membership: 'Yearly Plan',
      membershipStatus: 'Active',
      status: 'verified',
      lastRide: '1 day ago',
      avatar: 'PP',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Amit Sharma',
      email: 'amit.sharma@email.com',
      phone: '+91 9876543212',
      memberSince: 'Mar 2024',
      totalRides: 23,
      totalSpent: 650,
      membership: 'Pay Per Ride',
      membershipStatus: 'Active',
      status: 'verified',
      lastRide: '3 days ago',
      avatar: 'AS',
      rating: 4.5
    },
    {
      id: 4,
      name: 'Sneha Mehta',
      email: 'sneha.mehta@email.com',
      phone: '+91 9876543213',
      memberSince: 'Feb 2024',
      totalRides: 56,
      totalSpent: 1780,
      membership: 'Monthly Plan',
      membershipStatus: 'Expired',
      status: 'pending',
      lastRide: '1 week ago',
      avatar: 'SM',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Rahul Singh',
      email: 'rahul.singh@email.com',
      phone: '+91 9876543214',
      memberSince: 'Jan 2024',
      totalRides: 89,
      totalSpent: 3450,
      membership: 'Yearly Plan',
      membershipStatus: 'Active',
      status: 'verified',
      lastRide: '5 hours ago',
      avatar: 'RS',
      rating: 4.9
    },
  ];

  const stats = [
    { label: 'Total Customers', value: '2,847', icon: '👥', color: 'blue' },
    { label: 'Active Members', value: '1,245', icon: '⭐', color: 'green' },
    { label: 'New This Month', value: '156', icon: '📈', color: 'purple' },
    { label: 'Pending Verification', value: '23', icon: '⏳', color: 'orange' },
  ];

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="customer-management">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Manage all customer accounts and memberships</p>
        </div>
        <button className="add-customer-btn">
          <span>➕</span>
          Add New Customer
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
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Customers
          </button>
          <button
            className={`filter-btn ${filterStatus === 'verified' ? 'active' : ''}`}
            onClick={() => setFilterStatus('verified')}
          >
            Verified
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
        </div>

        <select className="sort-dropdown">
          <option>Sort by: Recent</option>
          <option>Sort by: Name</option>
          <option>Sort by: Rides</option>
          <option>Sort by: Spent</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="customers-table-card">
        <div className="table-header">
          <h2 className="table-title">
            <span className="table-icon">📋</span>
            All Customers
          </h2>
          <div className="table-actions">
            <button className="icon-btn">📥 Export</button>
            <button className="icon-btn">🔄 Refresh</button>
          </div>
        </div>

        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Member Since</th>
                <th>Rides</th>
                <th>Total Spent</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{customer.avatar}</div>
                      <div>
                        <p className="customer-name">{customer.name}</p>
                        <p className="customer-rating">⭐ {customer.rating}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <p>{customer.email}</p>
                      <p className="phone-number">{customer.phone}</p>
                    </div>
                  </td>
                  <td>
                    <span className="member-since">{customer.memberSince}</span>
                  </td>
                  <td>
                    <span className="rides-count">{customer.totalRides}</span>
                  </td>
                  <td>
                    <span className="spent-amount">₹{customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="membership-cell">
                      <span className="membership-plan">{customer.membership}</span>
                      <span className={`membership-status ${customer.membershipStatus.toLowerCase()}`}>
                        {customer.membershipStatus}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-cust-badge ${customer.status}`}>
                      {customer.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            {/* Customer Profile Header */}
            <div className="modal-header">
              <div className="modal-avatar">{selectedCustomer.avatar}</div>
              <div className="modal-user-info">
                <h2>{selectedCustomer.name}</h2>
                <span className={`verification-badge ${selectedCustomer.status}`}>
                  {selectedCustomer.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
              <div className="modal-stats">
                <div className="modal-stat-item">
                  <p className="modal-stat-value">{selectedCustomer.totalRides}</p>
                  <p className="modal-stat-label">Total Rides</p>
                </div>
                <div className="modal-stat-item">
                  <p className="modal-stat-value">₹{selectedCustomer.totalSpent}</p>
                  <p className="modal-stat-label">Total Spent</p>
                </div>
                <div className="modal-stat-item">
                  <p className="modal-stat-value">{selectedCustomer.memberSince}</p>
                  <p className="modal-stat-label">Member Since</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="modal-tabs">
              <button className="modal-tab active">📋 Personal Info</button>
              <button className="modal-tab">⭐ Membership</button>
              <button className="modal-tab">🚴 Ride History</button>
              <button className="modal-tab">💳 Payments</button>
            </div>

            {/* Personal Information */}
            <div className="modal-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div className="info-item">
                  <label>Last Ride</label>
                  <p>{selectedCustomer.lastRide}</p>
                </div>
                <div className="info-item">
                  <label>Customer Rating</label>
                  <p>⭐ {selectedCustomer.rating}</p>
                </div>
                <div className="info-item">
                  <label>Account Status</label>
                  <p className={selectedCustomer.status}>{selectedCustomer.status}</p>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="modal-section">
              <h3 className="section-title">Membership Details</h3>
              <div className="membership-card">
                <div className="membership-header">
                  <div>
                    <h4>{selectedCustomer.membership}</h4>
                    <p className="membership-price">
                      {selectedCustomer.membership === 'Monthly Plan' ? '₹499/month' : 
                       selectedCustomer.membership === 'Yearly Plan' ? '₹4,999/year' : 'Pay as you go'}
                    </p>
                  </div>
                  <span className={`membership-status-badge ${selectedCustomer.membershipStatus.toLowerCase()}`}>
                    {selectedCustomer.membershipStatus}
                  </span>
                </div>
                <div className="membership-benefits">
                  <div className="benefit-item">✓ 30 rides included</div>
                  <div className="benefit-item">✓ No peak hour charges</div>
                  <div className="benefit-item">✓ Priority support</div>
                  <div className="benefit-item">✓ Free helmet</div>
                </div>
                <div className="membership-actions">
                  <button className="action-btn-secondary">Cancel Plan</button>
                  <button className="action-btn-primary">Upgrade Plan</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-footer">
              <button className="footer-btn edit-btn">✏️ Edit Profile</button>
              <button className="footer-btn suspend-btn">⏸️ Suspend Account</button>
              <button className="footer-btn delete-btn">🗑️ Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;