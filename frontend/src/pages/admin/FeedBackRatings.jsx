import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/axiosConfig';
import '../../style/admin/FeedBackRatings.css';
import AdminNavbar from './AdminNavbar';


const FeedBackRatings = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [feedbackRes, summaryRes] = await Promise.all([
        axiosInstance.get('/admin/feedback'),
        axiosInstance.get('/admin/feedback/summary'),
      ]);
      setFeedbacks(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load feedback data.');
    } finally {
      setLoading(false);
    }
  };

  // ── Filter & Sort ──────────────────────────────────────────────
  const filtered = feedbacks
    .filter(f => {
      const matchSearch = (f.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.comments || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchRating = filterRating === 'all' || String(f.rating) === filterRating;
      return matchSearch && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.feedbackDate) - new Date(a.feedbackDate);
      if (sortBy === 'oldest') return new Date(a.feedbackDate) - new Date(b.feedbackDate);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest')  return a.rating - b.rating;
      return 0;
    });

  const renderStars = (rating, size = 'normal') => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'star-filled' : 'star-empty'} star-${size}`}>★</span>
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10b981';
    if (rating === 3) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getRatingLabel = (rating) => {
    switch(rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Poor';
      case 1: return 'Terrible';
      default: return '';
    }
  };

  if (loading) return (
    <div className="feedback-page">
      <div className="fb-loading">Loading feedback data...</div>
    </div>
  );

  if (error) return (
    <div className="feedback-page">
      <div className="fb-error">
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    </div>
  );

  return (
     <div className="fb-fleet-page">
    <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
    <div className={`feedback-page ${isNavCollapsed ? 'navbar-collapsed' : ''}`}></div>
    <div className="feedback-page">
      {/* Header */}
      <div className="fb-header">
        <div className="fb-header-title">
          <span className="fb-header-icon">⭐</span>
          <div>
            <h1>Feedback & Ratings</h1>
            <p>Customer feedback and satisfaction overview</p>
          </div>
        </div>
        <button className="fb-refresh-btn" onClick={loadData}>🔄 Refresh</button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="fb-summary-grid">
          <div className="fb-summary-card fb-summary-main">
            <div className="fb-big-rating">{summary.averageRating}</div>
            <div className="fb-big-stars">{renderStars(Math.round(summary.averageRating), 'large')}</div>
            <div className="fb-big-label">Average Rating</div>
            <div className="fb-big-total">{summary.totalFeedbacks} reviews total</div>
          </div>

          <div className="fb-summary-card fb-rating-breakdown">
            <h3>Rating Breakdown</h3>
            {[5,4,3,2,1].map(star => {
              const count = summary[`${['zero','one','two','three','four','five'][star]}StarCount`] ||
                            (star === 5 ? summary.fiveStarCount :
                             star === 4 ? summary.fourStarCount :
                             star === 3 ? summary.threeStarCount :
                             star === 2 ? summary.twoStarCount :
                             summary.oneStarCount) || 0;
              const pct = summary.totalFeedbacks > 0 ? Math.round((count / summary.totalFeedbacks) * 100) : 0;
              return (
                <div key={star} className="fb-bar-row">
                  <span className="fb-bar-label">{star}★</span>
                  <div className="fb-bar-track">
                    <div className="fb-bar-fill" style={{
                      width: `${pct}%`,
                      backgroundColor: getRatingColor(star)
                    }}></div>
                  </div>
                  <span className="fb-bar-count">{count}</span>
                  <span className="fb-bar-pct">{pct}%</span>
                </div>
              );
            })}
          </div>

          <div className="fb-summary-stats">
            {[
              { label: 'Total Reviews',   value: summary.totalFeedbacks,  icon: '📝', color: '#6366f1' },
              { label: '5 Star Reviews',  value: summary.fiveStarCount,   icon: '🌟', color: '#10b981' },
              { label: '4 Star Reviews',  value: summary.fourStarCount,   icon: '⭐', color: '#3b82f6' },
              { label: 'Needs Attention', value: (summary.oneStarCount || 0) + (summary.twoStarCount || 0), icon: '⚠️', color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="fb-mini-stat" style={{ borderLeftColor: s.color }}>
                <span className="fb-mini-icon">{s.icon}</span>
                <div>
                  <div className="fb-mini-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="fb-mini-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="fb-controls">
        <div className="fb-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by customer name or comment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && <button onClick={() => setSearchQuery('')}>✕</button>}
        </div>
        <div className="fb-filters">
          <select value={filterRating} onChange={e => setFilterRating(e.target.value)}>
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
        <div className="fb-results-info">Showing {filtered.length} of {feedbacks.length} reviews</div>
      </div>

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className="fb-empty">
          <p style={{ fontSize: '48px' }}>⭐</p>
          <h3>No feedback found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="fb-list">
          {filtered.map(f => (
            <div key={f.feedbackId} className="fb-card">
              <div className="fb-card-left">
                <div className="fb-avatar">{(f.customerName || '?')[0].toUpperCase()}</div>
              </div>
              <div className="fb-card-body">
                <div className="fb-card-top">
                  <div>
                    <span className="fb-customer-name">{f.customerName || 'Unknown'}</span>
                    <span className="fb-customer-id">ID #{f.customerId}</span>
                  </div>
                  <div className="fb-card-meta">
                    <span className="fb-date">📅 {formatDate(f.feedbackDate)}</span>
                    <span className="fb-feedback-id">#{f.feedbackId}</span>
                  </div>
                </div>
                <div className="fb-card-rating">
                  <div className="fb-stars">{renderStars(f.rating)}</div>
                  <span className="fb-rating-badge" style={{ backgroundColor: getRatingColor(f.rating) }}>
                    {f.rating}/5 — {getRatingLabel(f.rating)}
                  </span>
                </div>
                {f.comments && (
                  <div className="fb-comment">
                    <span className="fb-comment-icon">💬</span>
                    <p>{f.comments}</p>
                  </div>
                )}
                {!f.comments && (
                  <div className="fb-no-comment">No written comment</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    
  );
};

export default FeedBackRatings;