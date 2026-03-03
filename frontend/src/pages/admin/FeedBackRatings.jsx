import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, TrendingUp, MessageSquare, AlertCircle, ChevronDown, Calendar, User, MapPin, Bike } from 'lucide-react';
import '../../style/admin/feedbackratings.css';

const FeedbackRatings = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterIssueType, setFilterIssueType] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    avgRating: 0,
    critical: 0
  });

  // Mock data generation
  useEffect(() => {
    const issueTypes = ['Cycle Quality', 'Station Issue', 'Payment Problem', 'App Experience', 'Customer Service', 'Other'];
    const statuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const names = ['Raj Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Gupta'];
    const stations = ['Central Park', 'MG Road', 'Railway Station', 'Tech Park', 'City Mall', 'University Gate'];
    const comments = [
      'Great service, very convenient for daily commute.',
      'The cycle had some brake issues, needs maintenance.',
      'Payment was deducted twice for the same ride.',
      'App is very user-friendly and easy to navigate.',
      'Station was overcrowded, could not find a cycle.',
      'Excellent initiative for the city, keep it up!',
      'The cycle seat was uncomfortable for long rides.',
      'Quick customer support response, issue resolved fast.'
    ];

    const mockFeedbacks = Array.from({ length: 50 }, (_, i) => ({
      feedback_id: `FB${String(i + 1).padStart(4, '0')}`,
      customer_id: `CUST${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      customer_name: names[Math.floor(Math.random() * names.length)],
      transaction_id: `TXN${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      cycle_id: `CYC${String(Math.floor(Math.random() * 500)).padStart(3, '0')}`,
      station_id: `STN${String(Math.floor(Math.random() * 20)).padStart(2, '0')}`,
      station_name: stations[Math.floor(Math.random() * stations.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      comments: comments[Math.floor(Math.random() * comments.length)],
      feedback_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      issue_type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
      resolution_status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
    }));

    setFeedbacks(mockFeedbacks);
    setFilteredFeedbacks(mockFeedbacks);
    
    // Calculate stats
    const pending = mockFeedbacks.filter(f => f.resolution_status === 'Pending').length;
    const resolved = mockFeedbacks.filter(f => f.resolution_status === 'Resolved').length;
    const avgRating = (mockFeedbacks.reduce((acc, f) => acc + f.rating, 0) / mockFeedbacks.length).toFixed(1);
    const critical = mockFeedbacks.filter(f => f.priority === 'High' && f.resolution_status !== 'Resolved').length;

    setStats({
      total: mockFeedbacks.length,
      pending,
      resolved,
      avgRating,
      critical
    });
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.feedback_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.comments.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.resolution_status === filterStatus);
    }

    if (filterRating !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(filterRating));
    }

    if (filterIssueType !== 'all') {
      filtered = filtered.filter(f => f.issue_type === filterIssueType);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(f => {
        const feedbackDate = new Date(f.feedback_date);
        return feedbackDate >= new Date(dateRange.start) && feedbackDate <= new Date(dateRange.end);
      });
    }

    setFilteredFeedbacks(filtered);
  }, [searchTerm, filterStatus, filterRating, filterIssueType, dateRange, feedbacks]);

  const exportToCSV = () => {
    const headers = ['Feedback ID', 'Customer Name', 'Rating', 'Issue Type', 'Status', 'Date', 'Comments'];
    const rows = filteredFeedbacks.map(f => [
      f.feedback_id,
      f.customer_name,
      f.rating,
      f.issue_type,
      f.resolution_status,
      new Date(f.feedback_date).toLocaleDateString(),
      f.comments
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback_ratings.csv';
    a.click();
  };

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">
            <MessageSquare className="title-icon" size={40} />
            Feedback & Ratings Management
          </h1>
          <p className="subtitle">Monitor and manage customer feedback for SPINCity services</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Feedback</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <MessageSquare className="stat-icon stat-icon-primary" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value stat-value-warning">{stats.pending}</p>
              </div>
              <Clock className="stat-icon stat-icon-warning" size={32} />
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
                <p className="stat-label">Avg Rating</p>
                <p className="stat-value stat-value-primary">{stats.avgRating}</p>
              </div>
              <Star className="stat-icon stat-icon-rating" size={32} />
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
                placeholder="Search by customer, feedback ID, or comments..."
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
              <ChevronDown className={showFilters ? 'chevron-rotate' : ''} size={16} />
            </button>

            <button onClick={exportToCSV} className="export-btn">
              <Download size={18} />
              Export CSV
            </button>
          </div>

          {showFilters && (
            <div className="filter-dropdown">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={filterIssueType}
                onChange={(e) => setFilterIssueType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Issue Types</option>
                <option value="Cycle Quality">Cycle Quality</option>
                <option value="Station Issue">Station Issue</option>
                <option value="Payment Problem">Payment Problem</option>
                <option value="App Experience">App Experience</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="filter-select"
              />
            </div>
          )}
        </div>

        {/* Feedback Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Feedback ID</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Issue Type</th>
                  <th>Station</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.feedback_id} className="table-row">
                    <td>
                      <span className="feedback-id">{feedback.feedback_id}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <User size={16} className="customer-icon" />
                        <div>
                          <p className="customer-name">{feedback.customer_name}</p>
                          <p className="customer-id">{feedback.customer_id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < feedback.rating ? `star-filled rating-${feedback.rating}` : 'star-empty'}
                          />
                        ))}
                        <span className={`rating-value rating-${feedback.rating}`}>
                          {feedback.rating}.0
                        </span>
                      </div>
                    </td>
                    <td className="issue-type">{feedback.issue_type}</td>
                    <td>
                      <div className="station-info">
                        <MapPin size={14} className="station-icon" />
                        <span>{feedback.station_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge priority-${feedback.priority.toLowerCase()}`}>
                        {feedback.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge status-${feedback.resolution_status.toLowerCase().replace(' ', '-')}`}>
                        {feedback.resolution_status}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} className="date-icon" />
                        <span>{new Date(feedback.feedback_date).toLocaleDateString('en-IN')}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
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

          {filteredFeedbacks.length === 0 && (
            <div className="no-data">
              <MessageSquare size={48} className="no-data-icon" />
              <p>No feedback found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Detailed View Modal */}
        {selectedFeedback && (
          <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-section">
                  <h2 className="modal-title">Feedback Details</h2>
                  <p className="modal-feedback-id">{selectedFeedback.feedback_id}</p>
                </div>
                <button onClick={() => setSelectedFeedback(null)} className="modal-close">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="modal-body">
                {/* Customer Info */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <User size={18} />
                    Customer Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <p className="detail-label">Name</p>
                      <p className="detail-value">{selectedFeedback.customer_name}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Customer ID</p>
                      <p className="detail-value detail-mono">{selectedFeedback.customer_id}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <Bike size={18} />
                    Transaction Details
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <p className="detail-label">Transaction ID</p>
                      <p className="detail-value detail-mono">{selectedFeedback.transaction_id}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Cycle ID</p>
                      <p className="detail-value detail-mono">{selectedFeedback.cycle_id}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Station</p>
                      <p className="detail-value">{selectedFeedback.station_name}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Station ID</p>
                      <p className="detail-value detail-mono">{selectedFeedback.station_id}</p>
                    </div>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="detail-grid-2">
                  <div className="detail-section detail-rating">
                    <p className="detail-label">Rating</p>
                    <div className="rating-display">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className={i < selectedFeedback.rating ? `star-filled rating-${selectedFeedback.rating}` : 'star-empty'}
                        />
                      ))}
                      <span className={`rating-number rating-${selectedFeedback.rating}`}>
                        {selectedFeedback.rating}.0
                      </span>
                    </div>
                  </div>

                  <div className="detail-section detail-status">
                    <p className="detail-label">Status & Priority</p>
                    <div className="badge-group">
                      <span className={`badge status-${selectedFeedback.resolution_status.toLowerCase().replace(' ', '-')}`}>
                        {selectedFeedback.resolution_status}
                      </span>
                      <span className={`badge priority-${selectedFeedback.priority.toLowerCase()}`}>
                        {selectedFeedback.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Issue Type & Date */}
                <div className="detail-grid-2">
                  <div className="detail-item">
                    <p className="detail-label">Issue Type</p>
                    <p className="detail-value-box">{selectedFeedback.issue_type}</p>
                  </div>
                  <div className="detail-item">
                    <p className="detail-label">Feedback Date</p>
                    <p className="detail-value-box">
                      {new Date(selectedFeedback.feedback_date).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div className="detail-section">
                  <h3 className="detail-title">
                    <MessageSquare size={18} />
                    Customer Comments
                  </h3>
                  <p className="comment-box">{selectedFeedback.comments}</p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="action-btn-primary action-btn-success">
                    <CheckCircle size={18} />
                    Mark as Resolved
                  </button>
                  <button className="action-btn-primary action-btn-info">
                    <TrendingUp size={18} />
                    Assign Priority
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackRatings;