import React, { useState } from 'react';
import { 
  Receipt, Search, Filter, Download, Eye, Edit, CheckCircle,
  XCircle, Clock, Calendar, DollarSign, User, Bike, MapPin,
  ChevronDown, X, TrendingUp, TrendingDown, BarChart3, 
  FileText, RefreshCw, AlertCircle, ChevronRight, Package,
  CreditCard, Wallet, Smartphone, Plus, Activity, Award
} from 'lucide-react';
import '../../style/admin/rentaltransaction.css';

const RentalTransactionManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('date');

  // Mock transactions data
  const transactions = [
    {
      transaction_id: 'TXN001',
      customer_id: 'CUST001',
      customer_name: 'Amit Sharma',
      customer_email: 'amit.sharma@email.com',
      customer_phone: '+91 98765 43210',
      cycle_id: 'CYC001',
      cycle_name: 'Mountain Pro X1',
      rental_start_time: '2026-01-16 10:30 AM',
      rental_end_time: '2026-01-16 06:30 PM',
      pickup_station_id: 'STN001',
      pickup_station: 'Central Park Station',
      return_station_id: 'STN001',
      return_station: 'Central Park Station',
      rental_duration: '8 hours',
      total_amount: 200,
      payment_status: 'completed',
      payment_method: 'UPI',
      rental_status: 'completed',
      booking_date: '2026-01-15',
      addons: ['Safety Helmet', 'GPS Tracker'],
      rating: 4.5,
      feedback: 'Great experience! The bike was in excellent condition.'
    },
    {
      transaction_id: 'TXN002',
      customer_id: 'CUST002',
      customer_name: 'Priya Patel',
      customer_email: 'priya.patel@email.com',
      customer_phone: '+91 98765 43211',
      cycle_id: 'CYC005',
      cycle_name: 'Electric Swift E-200',
      rental_start_time: '2026-01-16 09:00 AM',
      rental_end_time: null,
      pickup_station_id: 'STN002',
      pickup_station: 'Beach View Station',
      return_station_id: null,
      return_station: null,
      rental_duration: 'Ongoing',
      total_amount: 500,
      payment_status: 'completed',
      payment_method: 'Credit Card',
      rental_status: 'active',
      booking_date: '2026-01-16',
      addons: ['Full Insurance', 'Safety Helmet'],
      rating: null,
      feedback: null
    },
    {
      transaction_id: 'TXN003',
      customer_id: 'CUST003',
      customer_name: 'Rahul Singh',
      customer_email: 'rahul.singh@email.com',
      customer_phone: '+91 98765 43212',
      cycle_id: 'CYC003',
      cycle_name: 'Speed Racer Pro',
      rental_start_time: '2026-01-16 02:00 PM',
      rental_end_time: null,
      pickup_station_id: 'STN003',
      pickup_station: 'Mall Road Station',
      return_station_id: null,
      return_station: null,
      rental_duration: 'Ongoing',
      total_amount: 350,
      payment_status: 'pending',
      payment_method: 'Cash on Pickup',
      rental_status: 'active',
      booking_date: '2026-01-16',
      addons: ['Front Basket'],
      rating: null,
      feedback: null
    },
    {
      transaction_id: 'TXN004',
      customer_id: 'CUST004',
      customer_name: 'Neha Gupta',
      customer_email: 'neha.gupta@email.com',
      customer_phone: '+91 98765 43213',
      cycle_id: 'CYC002',
      cycle_name: 'City Cruiser Alpha',
      rental_start_time: '2026-01-15 08:00 AM',
      rental_end_time: '2026-01-15 08:00 PM',
      pickup_station_id: 'STN004',
      pickup_station: 'University Station',
      return_station_id: 'STN002',
      return_station: 'Beach View Station',
      rental_duration: '12 hours',
      total_amount: 300,
      payment_status: 'completed',
      payment_method: 'Wallet',
      rental_status: 'completed',
      booking_date: '2026-01-14',
      addons: ['Safety Helmet', 'Premium Lock'],
      rating: 5.0,
      feedback: 'Excellent service! Would definitely rent again.'
    },
    {
      transaction_id: 'TXN005',
      customer_id: 'CUST005',
      customer_name: 'Vikas Malhotra',
      customer_email: 'vikas.m@email.com',
      customer_phone: '+91 98765 43214',
      cycle_id: 'CYC007',
      cycle_name: 'Trail Master X9',
      rental_start_time: '2026-01-14 03:00 PM',
      rental_end_time: null,
      pickup_station_id: 'STN001',
      pickup_station: 'Central Park Station',
      return_station_id: null,
      return_station: null,
      rental_duration: 'Overdue by 2 hours',
      total_amount: 450,
      payment_status: 'completed',
      payment_method: 'UPI',
      rental_status: 'overdue',
      booking_date: '2026-01-14',
      addons: ['Full Insurance', 'GPS Tracker'],
      rating: null,
      feedback: null
    },
    {
      transaction_id: 'TXN006',
      customer_id: 'CUST006',
      customer_name: 'Sneha Desai',
      customer_email: 'sneha.d@email.com',
      customer_phone: '+91 98765 43215',
      cycle_id: 'CYC004',
      cycle_name: 'Urban Explorer',
      rental_start_time: '2026-01-16 11:00 AM',
      rental_end_time: null,
      pickup_station_id: 'STN005',
      pickup_station: 'Tech Park Station',
      return_station_id: null,
      return_station: null,
      rental_duration: 'Scheduled',
      total_amount: 250,
      payment_status: 'failed',
      payment_method: 'Credit Card',
      rental_status: 'pending',
      booking_date: '2026-01-16',
      addons: ['Safety Helmet'],
      rating: null,
      feedback: null
    },
    {
      transaction_id: 'TXN007',
      customer_id: 'CUST007',
      customer_name: 'Arjun Reddy',
      customer_email: 'arjun.r@email.com',
      customer_phone: '+91 98765 43216',
      cycle_id: 'CYC008',
      cycle_name: 'Comfort Ride Deluxe',
      rental_start_time: '2026-01-13 07:00 AM',
      rental_end_time: '2026-01-13 09:00 PM',
      pickup_station_id: 'STN002',
      pickup_station: 'Beach View Station',
      return_station_id: 'STN002',
      return_station: 'Beach View Station',
      rental_duration: '14 hours',
      total_amount: 420,
      payment_status: 'completed',
      payment_method: 'UPI',
      rental_status: 'completed',
      booking_date: '2026-01-12',
      addons: ['Front Basket', 'GPS Tracker', 'Safety Helmet'],
      rating: 4.8,
      feedback: 'Very comfortable ride. Highly recommended!'
    },
    {
      transaction_id: 'TXN008',
      customer_id: 'CUST008',
      customer_name: 'Kavya Iyer',
      customer_email: 'kavya.i@email.com',
      customer_phone: '+91 98765 43217',
      cycle_id: 'CYC010',
      cycle_name: 'E-Thunder 3000',
      rental_start_time: '2026-01-15 01:00 PM',
      rental_end_time: null,
      pickup_station_id: 'STN003',
      pickup_station: 'Mall Road Station',
      return_station_id: null,
      return_station: null,
      rental_duration: 'Cancelled',
      total_amount: 600,
      payment_status: 'refunded',
      payment_method: 'Wallet',
      rental_status: 'cancelled',
      booking_date: '2026-01-15',
      addons: ['Full Insurance'],
      rating: null,
      feedback: null
    }
  ];

  // Statistics
  const stats = {
    total: transactions.length,
    active: transactions.filter(t => t.rental_status === 'active').length,
    completed: transactions.filter(t => t.rental_status === 'completed').length,
    pending: transactions.filter(t => t.rental_status === 'pending').length,
    overdue: transactions.filter(t => t.rental_status === 'overdue').length,
    cancelled: transactions.filter(t => t.rental_status === 'cancelled').length,
    totalRevenue: transactions
      .filter(t => t.payment_status === 'completed')
      .reduce((sum, t) => sum + t.total_amount, 0),
    todayRevenue: 2650,
    averageRental: (transactions.reduce((sum, t) => sum + t.total_amount, 0) / transactions.length).toFixed(0)
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.cycle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.rental_status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || transaction.payment_status === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch(sortBy) {
      case 'date': return new Date(b.booking_date) - new Date(a.booking_date);
      case 'amount': return b.total_amount - a.total_amount;
      case 'customer': return a.customer_name.localeCompare(b.customer_name);
      case 'status': return a.rental_status.localeCompare(b.rental_status);
      default: return 0;
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Activity size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'UPI': return <Smartphone size={16} />;
      case 'Credit Card': 
      case 'Debit Card': return <CreditCard size={16} />;
      case 'Wallet': return <Wallet size={16} />;
      case 'Cash on Pickup': return <DollarSign size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  return (
    <div className="rental-transaction-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Receipt className="title-icon" />
              Rental Transaction Management
            </h1>
            <p className="page-subtitle">View all transactions and manage rental bookings</p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <Download size={20} />
              Export Report
            </button>
            <button className="refresh-btn">
              <RefreshCw size={20} />
              Refresh
            </button>
          </div>
        </div>

       
      </div>
       {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon-wrapper">
              <Receipt size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{stats.total}</span>
              <span className="stat-detail">All time</span>
            </div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon-wrapper">
              <Activity size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Active Rentals</span>
              <span className="stat-value">{stats.active}</span>
              <span className="stat-detail">Currently ongoing</span>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon-wrapper">
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-trend positive">
                <TrendingUp size={14} />
                +12% this week
              </span>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon-wrapper">
              <Clock size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-detail">Awaiting confirmation</span>
            </div>
          </div>

          <div className="stat-card overdue">
            <div className="stat-icon-wrapper">
              <AlertCircle size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Overdue</span>
              <span className="stat-value">{stats.overdue}</span>
              <span className="stat-trend negative">
                <AlertCircle size={14} />
                Needs attention
              </span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon-wrapper">
              <DollarSign size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{stats.totalRevenue}</span>
              <span className="stat-detail">Today: ₹{stats.todayRevenue}</span>
            </div>
          </div>

          <div className="stat-card average">
            <div className="stat-icon-wrapper">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Avg Transaction</span>
              <span className="stat-value">₹{stats.averageRental}</span>
              <span className="stat-trend positive">
                <TrendingUp size={14} />
                +8% vs last month
              </span>
            </div>
          </div>

          <div className="stat-card cancelled">
            <div className="stat-icon-wrapper">
              <XCircle size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value">{stats.cancelled}</span>
              <span className="stat-detail">Refunded</span>
            </div>
          </div>
        </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-row">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by transaction ID, customer, email, or cycle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="control-buttons">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
              <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
            </button>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
              <option value="status">Sort by Status</option>
            </select>

            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Rental Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Payment Status</label>
              <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)}>
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <button 
              className="reset-filters"
              onClick={() => {
                setFilterStatus('all');
                setFilterPaymentStatus('all');
                setFilterDateRange('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        <div className="results-info">
          Showing {sortedTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transactions Display */}
      {viewMode === 'list' ? (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Cycle</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td className="txn-id-cell">{transaction.transaction_id}</td>
                  <td className="customer-cell">
                    <div className="customer-info">
                      <User size={16} />
                      <div>
                        <strong>{transaction.customer_name}</strong>
                        <span className="customer-email">{transaction.customer_email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="cycle-cell">
                    <Bike size={14} />
                    {transaction.cycle_name}
                  </td>
                  <td className="time-cell">
                    <Calendar size={14} />
                    {transaction.rental_start_time}
                  </td>
                  <td className="duration-cell">{transaction.rental_duration}</td>
                  <td className="amount-cell">₹{transaction.total_amount}</td>
                  <td>
                    <span 
                      className="payment-badge"
                      style={{ backgroundColor: getPaymentStatusColor(transaction.payment_status) }}
                    >
                      {transaction.payment_status}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="status-badge-table"
                      style={{ backgroundColor: getStatusColor(transaction.rental_status) }}
                    >
                      {getStatusIcon(transaction.rental_status)}
                      {transaction.rental_status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="table-action-btn"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowTransactionDetails(true);
                      }}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="transactions-grid">
          {sortedTransactions.map((transaction, index) => (
            <div 
              key={transaction.transaction_id} 
              className="transaction-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-header">
                <div className="txn-id">
                  <Receipt size={16} />
                  {transaction.transaction_id}
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(transaction.rental_status) }}
                >
                  {getStatusIcon(transaction.rental_status)}
                  {transaction.rental_status}
                </span>
              </div>

              <div className="card-body">
                <div className="customer-section">
                  <User size={18} />
                  <div>
                    <strong>{transaction.customer_name}</strong>
                    <span>{transaction.customer_phone}</span>
                  </div>
                </div>

                <div className="cycle-section">
                  <Bike size={18} />
                  <div>
                    <strong>{transaction.cycle_name}</strong>
                    <span>ID: {transaction.cycle_id}</span>
                  </div>
                </div>

                <div className="location-section">
                  <div className="location-item">
                    <MapPin size={14} />
                    <span>Pickup: {transaction.pickup_station}</span>
                  </div>
                  {transaction.return_station && (
                    <div className="location-item">
                      <MapPin size={14} />
                      <span>Return: {transaction.return_station}</span>
                    </div>
                  )}
                </div>

                <div className="time-section">
                  <div className="time-item">
                    <Calendar size={14} />
                    <span>{transaction.rental_start_time}</span>
                  </div>
                  <div className="duration-item">
                    <Clock size={14} />
                    <span>{transaction.rental_duration}</span>
                  </div>
                </div>

                <div className="payment-section">
                  <div className="payment-info">
                    {getPaymentMethodIcon(transaction.payment_method)}
                    <span>{transaction.payment_method}</span>
                  </div>
                  <span 
                    className="payment-status-badge"
                    style={{ backgroundColor: getPaymentStatusColor(transaction.payment_status) }}
                  >
                    {transaction.payment_status}
                  </span>
                </div>

                <div className="amount-section">
                  <span className="amount-label">Total Amount</span>
                  <span className="amount-value">₹{transaction.total_amount}</span>
                </div>

                {transaction.addons && transaction.addons.length > 0 && (
                  <div className="addons-section">
                    <Package size={14} />
                    <span>{transaction.addons.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button 
                  className="view-details-btn"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowTransactionDetails(true);
                  }}
                >
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedTransactions.length === 0 && (
        <div className="empty-state">
          <Receipt size={64} />
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowTransactionDetails(false)}>
          <div className="modal-content transaction-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="close-modal" onClick={() => setShowTransactionDetails(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="transaction-details">
              {/* Status Bar */}
              <div className="status-bar">
                <div className="status-info">
                  <span 
                    className="status-badge-large"
                    style={{ backgroundColor: getStatusColor(selectedTransaction.rental_status) }}
                  >
                    {getStatusIcon(selectedTransaction.rental_status)}
                    {selectedTransaction.rental_status.toUpperCase()}
                  </span>
                  <span 
                    className="payment-badge-large"
                    style={{ backgroundColor: getPaymentStatusColor(selectedTransaction.payment_status) }}
                  >
                    Payment: {selectedTransaction.payment_status}
                  </span>
                </div>
                <div className="transaction-id-large">
                  <Receipt size={20} />
                  {selectedTransaction.transaction_id}
                </div>
              </div>

              <div className="details-grid">
                {/* Customer Information */}
                <div className="detail-section">
                  <h3>
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedTransaction.customer_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Customer ID:</span>
                      <span className="detail-value">{selectedTransaction.customer_id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedTransaction.customer_email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedTransaction.customer_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Cycle Information */}
                <div className="detail-section">
                  <h3>
                    <Bike size={20} />
                    Cycle Information
                  </h3>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-label">Cycle Name:</span>
                      <span className="detail-value">{selectedTransaction.cycle_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cycle ID:</span>
                      <span className="detail-value">{selectedTransaction.cycle_id}</span>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="detail-section">
                  <h3>
                    <Calendar size={20} />
                    Rental Details
                  </h3>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-label">Booking Date:</span>
                      <span className="detail-value">{selectedTransaction.booking_date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Start Time:</span>
                      <span className="detail-value">{selectedTransaction.rental_start_time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">End Time:</span>
                      <span className="detail-value">{selectedTransaction.rental_end_time || 'Ongoing'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{selectedTransaction.rental_duration}</span>
                    </div>
                  </div>
                </div>

                {/* Station Information */}
                <div className="detail-section">
                  <h3>
                    <MapPin size={20} />
                    Station Information
                  </h3>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-label">Pickup Station:</span>
                      <span className="detail-value">{selectedTransaction.pickup_station}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pickup Station ID:</span>
                      <span className="detail-value">{selectedTransaction.pickup_station_id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Return Station:</span>
                      <span className="detail-value">{selectedTransaction.return_station || 'Not returned yet'}</span>
                    </div>
                    {selectedTransaction.return_station_id && (
                      <div className="detail-row">
                        <span className="detail-label">Return Station ID:</span>
                        <span className="detail-value">{selectedTransaction.return_station_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="detail-section">
                  <h3>
                    <DollarSign size={20} />
                    Payment Information
                  </h3>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">
                        <span className="payment-method-display">
                          {getPaymentMethodIcon(selectedTransaction.payment_method)}
                          {selectedTransaction.payment_method}
                        </span>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment Status:</span>
                      <span 
                        className="payment-badge-inline"
                        style={{ backgroundColor: getPaymentStatusColor(selectedTransaction.payment_status) }}
                      >
                        {selectedTransaction.payment_status}
                      </span>
                    </div>
                    <div className="detail-row total-amount-row">
                      <span className="detail-label">Total Amount:</span>
                      <span className="detail-value total-amount">₹{selectedTransaction.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                {selectedTransaction.addons && selectedTransaction.addons.length > 0 && (
                  <div className="detail-section">
                    <h3>
                      <Package size={20} />
                      Add-ons & Extras
                    </h3>
                    <div className="addons-list">
                      {selectedTransaction.addons.map((addon, idx) => (
                        <span key={idx} className="addon-tag">
                          <CheckCircle size={14} />
                          {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedTransaction.rating && (
                  <div className="detail-section full-width">
                    <h3>
                      <Award size={20} />
                      Customer Feedback
                    </h3>
                    <div className="feedback-content">
                      <div className="rating-display">
                        <span className="rating-value">{selectedTransaction.rating}</span>
                        <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                      </div>
                      {selectedTransaction.feedback && (
                        <p className="feedback-text">{selectedTransaction.feedback}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowTransactionDetails(false)}>
                Close
              </button>
              <button className="primary-btn">
                <FileText size={16} />
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalTransactionManagement;