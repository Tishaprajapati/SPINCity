import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle, XCircle, Clock, Search, Trash2 } from 'lucide-react';
import axiosInstance from '../../config/axiosConfig';
import '../../style/admin/AlertManagement.css';
import AdminNavbar from './AdminNavbar';

const AlertManagement = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('send');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    loadCustomers();
    const saved = localStorage.getItem('spincity_notification_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await axiosInstance.get('/admin/customers');
      const data = Array.isArray(res.data) ? res.data : res.data.content || res.data.data || [];
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const enabledCount  = customers.filter(c => c.notificationsEnabled !== false).length;
  const disabledCount = customers.filter(c => c.notificationsEnabled === false).length;

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setSendResult({ success: false, message: 'Please fill in both subject and message.' });
      return;
    }
    try {
      setSending(true);
      setSendResult(null);
      await axiosInstance.post('/customers/notifications/send', { subject, message });

      const entry = {
        id: Date.now(),
        subject,
        message,
        sentAt: new Date().toISOString(),
        recipientCount: enabledCount,
      };
      const newHistory = [entry, ...history];
      setHistory(newHistory);
      localStorage.setItem('spincity_notification_history', JSON.stringify(newHistory));

      setSendResult({ success: true, message: `Notification sent to ${enabledCount} customers successfully!` });
      setSubject('');
      setMessage('');
    } catch (err) {
      setSendResult({ success: false, message: 'Failed to send notification. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('spincity_notification_history');
  };

  const filteredCustomers = customers.filter(c => {
    const name  = (c.customerName || c.name || '').toLowerCase();
    const email = (c.customerEmail || c.email || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const templates = [
    { label: '🎉 New Feature',   subject: 'New Feature Alert!',           message: 'We just launched an exciting new feature on SpinCity! Log in to explore it now.' },
    { label: '🏷️ Offer',         subject: 'Special Offer Just for You!',   message: 'Get 20% off your next ride this weekend. Use code SPIN20 at checkout!' },
    { label: '🔧 Maintenance',   subject: 'Scheduled Maintenance Notice',  message: 'We will be performing scheduled maintenance on our systems. Some features may be temporarily unavailable.' },
    { label: '📢 Announcement',  subject: 'Important Announcement',        message: 'We have an important update to share with all SpinCity users. Please read carefully.' },
  ];

  return (
     <div className="fb-fleet-page">
    <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
    <div className={`feedback-page ${isNavCollapsed ? 'navbar-collapsed' : ''}`}></div>
    <div className="alert-management">
      {/* Header */}
      <div className="am-header">
        <div className="am-header-title">
          <Bell size={28} className="am-header-icon" />
          <div>
            <h1>Notifications & Alerts</h1>
            <p>Send notifications to customers and manage alert history</p>
          </div>
        </div>
        <button className="am-refresh-btn" onClick={loadCustomers}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="am-stats-row">
        <div className="am-stat-card am-stat-blue">
          <div className="am-stat-icon"><Users size={24} /></div>
          <div className="am-stat-info">
            <span className="am-stat-value">{customers.length}</span>
            <span className="am-stat-label">Total Customers</span>
          </div>
        </div>
        <div className="am-stat-card am-stat-green">
          <div className="am-stat-icon"><CheckCircle size={24} /></div>
          <div className="am-stat-info">
            <span className="am-stat-value">{enabledCount}</span>
            <span className="am-stat-label">Will Receive</span>
          </div>
        </div>
        <div className="am-stat-card am-stat-red">
          <div className="am-stat-icon"><XCircle size={24} /></div>
          <div className="am-stat-info">
            <span className="am-stat-value">{disabledCount}</span>
            <span className="am-stat-label">Opted Out</span>
          </div>
        </div>
        <div className="am-stat-card am-stat-purple">
          <div className="am-stat-icon"><Clock size={24} /></div>
          <div className="am-stat-info">
            <span className="am-stat-value">{history.length}</span>
            <span className="am-stat-label">Sent Total</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="am-tabs">
        <button className={`am-tab ${activeTab === 'send' ? 'active' : ''}`} onClick={() => setActiveTab('send')}>
          <Send size={16} /> Send Notification
        </button>
        <button className={`am-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <Clock size={16} /> Sent History {history.length > 0 && <span className="am-tab-badge">{history.length}</span>}
        </button>
        <button className={`am-tab ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
          <Users size={16} /> Customer List
        </button>
      </div>

      {/* ── SEND TAB ── */}
      {activeTab === 'send' && (
        <div className="am-content">
          <div className="am-send-grid">
            {/* Compose */}
            <div className="am-compose-card">
              <h2 className="am-card-title">✉️ Compose Notification</h2>

              {/* Templates */}
              <div className="am-templates">
                <p className="am-templates-label">Quick Templates:</p>
                <div className="am-templates-row">
                  {templates.map((t, i) => (
                    <button key={i} className="am-template-btn"
                      onClick={() => { setSubject(t.subject); setMessage(t.message); setSendResult(null); }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="am-form-group">
                <label className="am-label">Subject *</label>
                <input
                  type="text"
                  className="am-input"
                  placeholder="e.g. New Feature Launch!"
                  value={subject}
                  onChange={e => { setSubject(e.target.value); setSendResult(null); }}
                  maxLength={100}
                />
                <span className="am-char-count">{subject.length}/100</span>
              </div>

              <div className="am-form-group">
                <label className="am-label">Message *</label>
                <textarea
                  className="am-textarea"
                  placeholder="Write your notification message here..."
                  value={message}
                  onChange={e => { setMessage(e.target.value); setSendResult(null); }}
                  rows={5}
                  maxLength={500}
                />
                <span className="am-char-count">{message.length}/500</span>
              </div>

              {/* Result */}
              {sendResult && (
                <div className={`am-result ${sendResult.success ? 'am-result-success' : 'am-result-error'}`}>
                  {sendResult.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  {sendResult.message}
                </div>
              )}

              <button
                className="am-send-btn"
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim()}
              >
                {sending ? (
                  <><span className="am-spinner"></span> Sending...</>
                ) : (
                  <><Send size={18} /> Send to {enabledCount} Customers</>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="am-preview-card">
              <h2 className="am-card-title">📱 Preview</h2>
              <div className="am-phone-preview">
                <div className="am-phone-notif">
                  <div className="am-phone-notif-header">
                    <span className="am-phone-app">🚴 SpinCity</span>
                    <span className="am-phone-time">now</span>
                  </div>
                  <div className="am-phone-subject">{subject || 'Notification Subject'}</div>
                  <div className="am-phone-message">{message || 'Your notification message will appear here...'}</div>
                </div>
              </div>

              <div className="am-recipients-info">
                <h3>📊 Delivery Summary</h3>
                <div className="am-delivery-row">
                  <span>✅ Will receive</span>
                  <strong style={{ color: '#10b981' }}>{enabledCount} customers</strong>
                </div>
                <div className="am-delivery-row">
                  <span>❌ Opted out</span>
                  <strong style={{ color: '#ef4444' }}>{disabledCount} customers</strong>
                </div>
                <div className="am-delivery-row">
                  <span>📧 Total registered</span>
                  <strong>{customers.length} customers</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div className="am-content">
          <div className="am-history-header">
            <h2 className="am-card-title">📋 Sent Notification History</h2>
            {history.length > 0 && (
              <button className="am-clear-btn" onClick={clearHistory}>
                <Trash2 size={16} /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="am-empty">
              <Bell size={48} />
              <h3>No notifications sent yet</h3>
              <p>Notifications you send will appear here</p>
            </div>
          ) : (
            <div className="am-history-list">
              {history.map((item) => (
                <div key={item.id} className="am-history-item">
                  <div className="am-history-icon">📧</div>
                  <div className="am-history-content">
                    <div className="am-history-subject">{item.subject}</div>
                    <div className="am-history-message">{item.message}</div>
                    <div className="am-history-meta">
                      <span><Clock size={12} /> {formatDate(item.sentAt)}</span>
                      <span><Users size={12} /> Sent to {item.recipientCount} customers</span>
                    </div>
                  </div>
                  <div className="am-history-badge">✅ Sent</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CUSTOMERS TAB ── */}
      {activeTab === 'customers' && (
        <div className="am-content">
          <div className="am-customers-header">
            <h2 className="am-card-title">👥 Customer Notification Status</h2>
            <div className="am-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="am-search-input"
              />
            </div>
          </div>

          {loadingCustomers ? (
            <div className="am-loading">Loading customers...</div>
          ) : (
            <div className="am-customers-table-wrap">
              <table className="am-customers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Notifications</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c, i) => (
                    <tr key={c.customerId || c.id || i}>
                      <td>{i + 1}</td>
                      <td className="am-customer-name">{c.customerName || c.name || 'N/A'}</td>
                      <td className="am-customer-email">{c.customerEmail || c.email || 'N/A'}</td>
                      <td>
                        {c.notificationsEnabled !== false ? (
                          <span className="am-notif-on">✅ Enabled</span>
                        ) : (
                          <span className="am-notif-off">❌ Opted Out</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No customers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default AlertManagement;