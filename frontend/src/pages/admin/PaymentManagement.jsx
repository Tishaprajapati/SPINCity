import React, { useState } from 'react';
import '../../style/admin/paymentmanagement.css';

const PaymentManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Mock payment data
  const allPayments = [
    {
      payment_id: 'PAY001',
      transaction_id: 'TXN2024011501',
      customer_id: 'CUST001',
      customer_name: 'Rajesh Kumar',
      customer_email: 'rajesh.kumar@email.com',
      amount: 499,
      payment_method: 'UPI',
      payment_type: 'Membership',
      payment_date: '2024-01-15 10:30 AM',
      payment_status: 'completed',
      transaction_reference: 'UPI2024011501234',
      description: 'Monthly Plan Renewal',
      invoice_number: 'INV-2024-001'
    },
    {
      payment_id: 'PAY002',
      transaction_id: 'TXN2024011502',
      customer_id: 'CUST002',
      customer_name: 'Priya Patel',
      customer_email: 'priya.patel@email.com',
      amount: 150,
      payment_method: 'Credit Card',
      payment_type: 'Rental',
      payment_date: '2024-01-15 11:45 AM',
      payment_status: 'completed',
      transaction_reference: 'CC2024011502345',
      description: 'Cycle Rental - 3 hours',
      invoice_number: 'INV-2024-002'
    },
    {
      payment_id: 'PAY003',
      transaction_id: 'TXN2024011503',
      customer_id: 'CUST003',
      customer_name: 'Amit Sharma',
      customer_email: 'amit.sharma@email.com',
      amount: 200,
      payment_method: 'Debit Card',
      payment_type: 'Wallet Recharge',
      payment_date: '2024-01-15 02:15 PM',
      payment_status: 'pending',
      transaction_reference: 'DC2024011503456',
      description: 'Wallet Top-up',
      invoice_number: 'INV-2024-003'
    },
    {
      payment_id: 'PAY004',
      transaction_id: 'TXN2024011504',
      customer_id: 'CUST004',
      customer_name: 'Sneha Mehta',
      customer_email: 'sneha.mehta@email.com',
      amount: 4999,
      payment_method: 'Net Banking',
      payment_type: 'Membership',
      payment_date: '2024-01-15 03:30 PM',
      payment_status: 'completed',
      transaction_reference: 'NB2024011504567',
      description: 'Yearly Plan Purchase',
      invoice_number: 'INV-2024-004'
    },
    {
      payment_id: 'PAY005',
      transaction_id: 'TXN2024011505',
      customer_id: 'CUST005',
      customer_name: 'Rahul Singh',
      customer_email: 'rahul.singh@email.com',
      amount: 89,
      payment_method: 'UPI',
      payment_type: 'Rental',
      payment_date: '2024-01-15 04:20 PM',
      payment_status: 'failed',
      transaction_reference: 'UPI2024011505678',
      description: 'Cycle Rental - 2 hours',
      invoice_number: 'INV-2024-005'
    },
    {
      payment_id: 'PAY006',
      transaction_id: 'TXN2024011506',
      customer_id: 'CUST006',
      customer_name: 'Kavita Desai',
      customer_email: 'kavita.desai@email.com',
      amount: 150,
      payment_method: 'Credit Card',
      payment_type: 'Refund',
      payment_date: '2024-01-15 05:10 PM',
      payment_status: 'refunded',
      transaction_reference: 'REF2024011506789',
      description: 'Refund for cancelled ride',
      invoice_number: 'INV-2024-006'
    },
    {
      payment_id: 'PAY007',
      transaction_id: 'TXN2024011507',
      customer_id: 'CUST007',
      customer_name: 'Neha Gupta',
      customer_email: 'neha.gupta@email.com',
      amount: 500,
      payment_method: 'Wallet',
      payment_type: 'Rental',
      payment_date: '2024-01-16 09:00 AM',
      payment_status: 'completed',
      transaction_reference: 'WAL2024011607890',
      description: 'Multiple rides payment',
      invoice_number: 'INV-2024-007'
    },
    {
      payment_id: 'PAY008',
      transaction_id: 'TXN2024011508',
      customer_id: 'CUST008',
      customer_name: 'Vikram Shah',
      customer_email: 'vikram.shah@email.com',
      amount: 1000,
      payment_method: 'UPI',
      payment_type: 'Wallet Recharge',
      payment_date: '2024-01-16 10:30 AM',
      payment_status: 'completed',
      transaction_reference: 'UPI2024011608901',
      description: 'Wallet Top-up',
      invoice_number: 'INV-2024-008'
    }
  ];

  // Calculate statistics
  const stats = {
    totalRevenue: allPayments.reduce((sum, p) => sum + p.amount, 0),
    totalTransactions: allPayments.length,
    completedPayments: allPayments.filter(p => p.payment_status === 'completed').length,
    pendingPayments: allPayments.filter(p => p.payment_status === 'pending').length,
    failedPayments: allPayments.filter(p => p.payment_status === 'failed').length,
    refundedAmount: allPayments.filter(p => p.payment_status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
    membershipRevenue: allPayments.filter(p => p.payment_type === 'Membership').reduce((sum, p) => sum + p.amount, 0),
    rentalRevenue: allPayments.filter(p => p.payment_type === 'Rental').reduce((sum, p) => sum + p.amount, 0)
  };

  // Payment method breakdown
  const methodStats = {
    upi: allPayments.filter(p => p.payment_method === 'UPI').length,
    card: allPayments.filter(p => p.payment_method === 'Credit Card' || p.payment_method === 'Debit Card').length,
    netBanking: allPayments.filter(p => p.payment_method === 'Net Banking').length,
    wallet: allPayments.filter(p => p.payment_method === 'Wallet').length
  };

  // Filter payments
  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.payment_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.payment_status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.payment_method === filterMethod;
    const matchesType = filterType === 'all' || payment.payment_type === filterType;
    return matchesSearch && matchesStatus && matchesMethod && matchesType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'UPI': return '📱';
      case 'Credit Card': return '💳';
      case 'Debit Card': return '💳';
      case 'Net Banking': return '🏦';
      case 'Wallet': return '💰';
      default: return '💵';
    }
  };

  return (
    <div className="payment-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <span className="title-icon">💳</span>
              Payment Management
            </h1>
            <p className="page-subtitle">Monitor all transactions and payment activities</p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <span>📥</span>
              Export Report
            </button>
            <button className="generate-btn">
              <span>📄</span>
              Generate Invoice
            </button>
          </div>
        </div>

       
      </div>
       {/* Revenue Statistics */}
        <div className="stats-grid">
          <div className="stat-card total-revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-trend positive">📈 +23% vs last month</span>
            </div>
          </div>

          <div className="stat-card total-transactions">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{stats.totalTransactions}</span>
              <span className="stat-detail">{stats.completedPayments} completed</span>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-label">Pending Payments</span>
              <span className="stat-value">{stats.pendingPayments}</span>
              <span className="stat-detail">Awaiting confirmation</span>
            </div>
          </div>

          <div className="stat-card failed">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <span className="stat-label">Failed Payments</span>
              <span className="stat-value">{stats.failedPayments}</span>
              <span className="stat-detail">Requires attention</span>
            </div>
          </div>

          <div className="stat-card membership">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-label">Membership Revenue</span>
              <span className="stat-value">₹{stats.membershipRevenue.toLocaleString()}</span>
              <span className="stat-detail">{Math.round((stats.membershipRevenue/stats.totalRevenue)*100)}% of total</span>
            </div>
          </div>

          <div className="stat-card rental">
            <div className="stat-icon">🚴</div>
            <div className="stat-content">
              <span className="stat-label">Rental Revenue</span>
              <span className="stat-value">₹{stats.rentalRevenue.toLocaleString()}</span>
              <span className="stat-detail">{Math.round((stats.rentalRevenue/stats.totalRevenue)*100)}% of total</span>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="payment-methods-section">
          <h2 className="section-title">Payment Methods Distribution</h2>
          <div className="methods-grid">
            <div className="method-card">
              <span className="method-icon">📱</span>
              <div className="method-info">
                <span className="method-name">UPI</span>
                <span className="method-count">{methodStats.upi} transactions</span>
              </div>
            </div>
            <div className="method-card">
              <span className="method-icon">💳</span>
              <div className="method-info">
                <span className="method-name">Cards</span>
                <span className="method-count">{methodStats.card} transactions</span>
              </div>
            </div>
            <div className="method-card">
              <span className="method-icon">🏦</span>
              <div className="method-info">
                <span className="method-name">Net Banking</span>
                <span className="method-count">{methodStats.netBanking} transactions</span>
              </div>
            </div>
            <div className="method-card">
              <span className="method-icon">💰</span>
              <div className="method-info">
                <span className="method-name">Wallet</span>
                <span className="method-count">{methodStats.wallet} transactions</span>
              </div>
            </div>
          </div>
        </div>

      {/* Filters & Search */}
      <div className="controls-section">
        <div className="search-filter-row">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by transaction ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>

            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Membership">Membership</option>
              <option value="Rental">Rental</option>
              <option value="Wallet Recharge">Wallet Recharge</option>
              <option value="Refund">Refund</option>
            </select>

            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredPayments.length} of {allPayments.length} transactions
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-card">
        <div className="table-header">
          <h2 className="table-title">
            <span>📋</span>
            All Transactions
          </h2>
        </div>

        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td>
                    <div className="transaction-id-cell">
                      <strong>{payment.transaction_id}</strong>
                      <span className="payment-id">{payment.payment_id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <strong>{payment.customer_name}</strong>
                      <span className="customer-email">{payment.customer_email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="amount-cell">₹{payment.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="type-badge">{payment.payment_type}</span>
                  </td>
                  <td>
                    <div className="method-cell">
                      <span className="method-icon-table">{getPaymentMethodIcon(payment.payment_method)}</span>
                      <span>{payment.payment_method}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <span>{payment.payment_date}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge-table"
                      style={{ backgroundColor: getStatusColor(payment.payment_status) }}
                    >
                      {payment.payment_status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="action-btn view"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentDetails(true);
                        }}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button className="action-btn download" title="Download Invoice">
                        📥
                      </button>
                      {payment.payment_status === 'completed' && (
                        <button 
                          className="action-btn refund"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowRefundModal(true);
                          }}
                          title="Process Refund"
                        >
                          💸
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentDetails(false)}>
          <div className="modal-content payment-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentDetails(false)}>✕</button>
            
            <div className="modal-header-payment">
              <div className="modal-payment-title">
                <h2>Payment Details</h2>
                <span className="modal-transaction-id">{selectedPayment.transaction_id}</span>
              </div>
              <span 
                className="modal-status-badge"
                style={{ backgroundColor: getStatusColor(selectedPayment.payment_status) }}
              >
                {selectedPayment.payment_status}
              </span>
            </div>

            <div className="modal-body-payment">
              <div className="payment-details-grid">
                <div className="detail-section">
                  <h3>💳 Transaction Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Payment ID:</span>
                    <span className="detail-value">{selectedPayment.payment_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transaction ID:</span>
                    <span className="detail-value">{selectedPayment.transaction_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transaction Reference:</span>
                    <span className="detail-value">{selectedPayment.transaction_reference}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Invoice Number:</span>
                    <span className="detail-value">{selectedPayment.invoice_number}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>👤 Customer Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Customer ID:</span>
                    <span className="detail-value">{selectedPayment.customer_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedPayment.customer_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedPayment.customer_email}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💰 Payment Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value amount-highlight">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">
                      {getPaymentMethodIcon(selectedPayment.payment_method)} {selectedPayment.payment_method}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Type:</span>
                    <span className="detail-value">{selectedPayment.payment_type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">{selectedPayment.payment_date}</span>
                  </div>
                </div>

                <div className="detail-section full-width">
                  <h3>📝 Description</h3>
                  <p className="description-text">{selectedPayment.description}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-payment">
              <button className="footer-btn secondary" onClick={() => setShowPaymentDetails(false)}>
                Close
              </button>
              <button className="footer-btn action">
                📥 Download Invoice
              </button>
              {selectedPayment.payment_status === 'completed' && (
                <button 
                  className="footer-btn refund"
                  onClick={() => {
                    setShowPaymentDetails(false);
                    setShowRefundModal(true);
                  }}
                >
                  💸 Process Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
          <div className="modal-content refund-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRefundModal(false)}>✕</button>
            
            <div className="modal-header-simple">
              <h2>💸 Process Refund</h2>
            </div>

            <div className="modal-body-form">
              <div className="refund-info-box">
                <div className="refund-detail">
                  <span className="refund-label">Transaction ID:</span>
                  <span className="refund-value">{selectedPayment.transaction_id}</span>
                </div>
                <div className="refund-detail">
                  <span className="refund-label">Customer:</span>
                  <span className="refund-value">{selectedPayment.customer_name}</span>
                </div>
                <div className="refund-detail">
                  <span className="refund-label">Original Amount:</span>
                  <span className="refund-value amount-highlight">₹{selectedPayment.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Refund Amount</label>
                <input type="number" placeholder="Enter refund amount" defaultValue={selectedPayment.amount} />
              </div>

              <div className="form-group">
                <label>Refund Reason</label>
                <select>
                  <option>Customer Request</option>
                  <option>Service Issue</option>
                  <option>Duplicate Payment</option>
                  <option>Cancelled Booking</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea rows="4" placeholder="Enter any additional notes..."></textarea>
              </div>
            </div>

            <div className="modal-footer-simple">
              <button className="footer-btn secondary" onClick={() => setShowRefundModal(false)}>
                Cancel
              </button>
              <button className="footer-btn danger">
                💸 Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;