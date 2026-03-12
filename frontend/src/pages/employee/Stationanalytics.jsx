import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStationAnalytics } from '../../service/employeeService';
import EmpNavbar from './Empnavbar';
import '../../style/employee/stationanalytics.css';

const StationAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('startTime');
  const [sortDir, setSortDir] = useState('desc');

  const stationId = localStorage.getItem('stationId');
  const empName   = localStorage.getItem('staffName');

  useEffect(() => {
    if (stationId) loadAnalytics();
  }, [stationId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetchStationAnalytics(stationId);
      setData(res);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fmtCurrency = (v) => `₹${(v || 0).toFixed(2)}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

  const getDepositBadge = (s) => {
    if (s === 'RETURNED')  return { label: 'Returned',  cls: 'dep-returned' };
    if (s === 'COLLECTED') return { label: 'Collected', cls: 'dep-collected' };
    if (s === 'FORFEITED') return { label: 'Forfeited', cls: 'dep-forfeited' };
    return { label: 'Not Paid', cls: 'dep-notpaid' };
  };

  const getPayBadge = (s) => {
    if (s === 'Paid' || s === 'Success') return { label: 'Paid', cls: 'pay-paid' };
    if (s === 'Pending') return { label: 'Pending', cls: 'pay-pending' };
    return { label: s || '—', cls: 'pay-pending' };
  };

  const filteredRides = () => {
    if (!data?.recentRides) return [];
    let rides = [...data.recentRides];

    // Period filter
    const now = new Date();
    if (filterPeriod === 'week') {
      const weekAgo = new Date(now - 7 * 86400000);
      rides = rides.filter(r => new Date(r.startTime) >= weekAgo);
    } else if (filterPeriod === 'today') {
      rides = rides.filter(r => {
        const d = new Date(r.startTime);
        return d.toDateString() === now.toDateString();
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rides = rides.filter(r =>
        r.customerName?.toLowerCase().includes(q) ||
        r.cycleName?.toLowerCase().includes(q) ||
        r.returnStation?.toLowerCase().includes(q)
      );
    }

    // Sort
    rides.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'startTime' || sortField === 'endTime') {
        av = new Date(av || 0); bv = new Date(bv || 0);
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rides;
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => (
    <span className="sa-sort-icon">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
    </span>
  );

  if (loading) return (
    <div className="sa-page">
      <EmpNavbar onCollapse={setSidebarCollapsed} />
      <main className={`sa-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sa-loading"><div className="sa-spinner" /><p>Loading Analytics...</p></div>
      </main>
    </div>
  );

  const rides = filteredRides();
  const totalRevenue = rides.reduce((s, r) => s + (r.totalAmount || 0), 0);

  return (
    <div className="sa-page">
      <EmpNavbar onCollapse={setSidebarCollapsed} />

      <main className={`sa-main ${sidebarCollapsed ? 'collapsed' : ''}`}>

        {/* ── Header ── */}
        <div className="sa-header">
          <div className="sa-header-left">
            <Link to="/employeedashboard" className="sa-back-btn">← Back</Link>
            <div>
              <h1 className="sa-title">📊 Station Analytics</h1>
              <p className="sa-subtitle">
                {data?.stationName || `Station #${stationId}`} · Last 30 days overview
              </p>
            </div>
          </div>
          <button className="sa-refresh-btn" onClick={loadAnalytics}>↻ Refresh</button>
        </div>

        {/* ── Revenue Cards ── */}
        <div className="sa-cards-grid">
          {[
            { label: "Today's Revenue",   value: fmtCurrency(data?.todayRevenue),   icon: '💰', cls: 'card-today',   sub: 'collected today' },
            { label: 'Weekly Revenue',    value: fmtCurrency(data?.weeklyRevenue),  icon: '📅', cls: 'card-weekly',  sub: 'last 7 days' },
            { label: 'Monthly Revenue',   value: fmtCurrency(data?.monthlyRevenue), icon: '📈', cls: 'card-monthly', sub: 'last 30 days' },
            { label: "Today's Riders",    value: data?.todayRiders ?? 0,            icon: '🚴', cls: 'card-riders1', sub: 'rides today' },
            { label: 'Weekly Riders',     value: data?.weeklyRiders ?? 0,           icon: '👥', cls: 'card-riders2', sub: 'last 7 days' },
            { label: 'Monthly Riders',    value: data?.monthlyRiders ?? 0,          icon: '🏆', cls: 'card-riders3', sub: 'last 30 days' },
          ].map((c, i) => (
            <div key={i} className={`sa-card ${c.cls}`} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="sa-card-icon">{c.icon}</div>
              <div className="sa-card-body">
                <span className="sa-card-label">{c.label}</span>
                <span className="sa-card-value">{c.value}</span>
                <span className="sa-card-sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ride History Table ── */}
        <div className="sa-table-section">
          <div className="sa-table-header">
            <div className="sa-table-title-row">
              <h2 className="sa-table-title">🗂 Ride History</h2>
              <span className="sa-table-count">{rides.length} rides · ₹{totalRevenue.toFixed(2)} total</span>
            </div>

            {/* Filters */}
            <div className="sa-filters">
              <div className="sa-period-tabs">
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'week',  label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                ].map(p => (
                  <button
                    key={p.key}
                    className={`sa-period-btn ${filterPeriod === p.key ? 'active' : ''}`}
                    onClick={() => setFilterPeriod(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input
                className="sa-search"
                placeholder="🔍 Search customer, cycle, station..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th onClick={() => toggleSort('customerName')} className="sa-sortable">
                    Customer <SortIcon field="customerName" />
                  </th>
                  <th onClick={() => toggleSort('cycleName')} className="sa-sortable">
                    Cycle <SortIcon field="cycleName" />
                  </th>
                  <th>Pickup Station</th>
                  <th>Return Station</th>
                  <th onClick={() => toggleSort('startTime')} className="sa-sortable">
                    Start <SortIcon field="startTime" />
                  </th>
                  <th onClick={() => toggleSort('endTime')} className="sa-sortable">
                    End <SortIcon field="endTime" />
                  </th>
                  <th>Duration</th>
                  <th onClick={() => toggleSort('totalAmount')} className="sa-sortable">
                    Amount <SortIcon field="totalAmount" />
                  </th>
                  <th>Payment</th>
                  <th>Deposit</th>
                </tr>
              </thead>
              <tbody>
                {rides.length === 0 ? (
                  <tr><td colSpan={11} className="sa-empty">No rides found for selected period</td></tr>
                ) : (
                  rides.map((r, i) => {
                    const dep = getDepositBadge(r.depositStatus);
                    const pay = getPayBadge(r.paymentStatus);
                    const isCross = r.pickupStation !== r.returnStation;
                    return (
                      <tr key={r.transactionId} className={isCross ? 'sa-row-cross' : ''}>
                        <td className="sa-td-num">{i + 1}</td>
                        <td>
                          <div className="sa-customer-cell">
                            <div className="sa-avatar">{r.customerName?.charAt(0)}</div>
                            <div>
                              <strong>{r.customerName}</strong>
                              <small>{r.customerPhone}</small>
                            </div>
                          </div>
                        </td>
                        <td className="sa-td-cycle">{r.cycleName}</td>
                        <td className="sa-td-station">{r.pickupStation}</td>
                        <td className="sa-td-station">
                          {isCross
                            ? <span className="sa-cross-badge">🔀 {r.returnStation}</span>
                            : r.returnStation
                          }
                        </td>
                        <td>
                          <div className="sa-time-cell">
                            <span>{fmtDate(r.startTime)}</span>
                            <small>{fmtTime(r.startTime)}</small>
                          </div>
                        </td>
                        <td>
                          <div className="sa-time-cell">
                            <span>{fmtDate(r.endTime)}</span>
                            <small>{fmtTime(r.endTime)}</small>
                          </div>
                        </td>
                        <td className="sa-td-dur">
                          {r.durationMinutes != null ? `${r.durationMinutes} min` : '—'}
                        </td>
                        <td className="sa-td-amount">
                          {r.totalAmount > 0 ? `₹${r.totalAmount.toFixed(2)}` : <span className="sa-free">FREE</span>}
                        </td>
                        <td><span className={`sa-badge ${pay.cls}`}>{pay.label}</span></td>
                        <td><span className={`sa-badge ${dep.cls}`}>{dep.label}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          {rides.length > 0 && (
            <div className="sa-summary-footer">
              <div className="sa-summary-item">
                <span>Total Rides</span>
                <strong>{rides.length}</strong>
              </div>
              <div className="sa-summary-item">
                <span>Total Revenue</span>
                <strong>₹{totalRevenue.toFixed(2)}</strong>
              </div>
              <div className="sa-summary-item">
                <span>Cross-Station Rides</span>
                <strong>{rides.filter(r => r.pickupStation !== r.returnStation).length}</strong>
              </div>
              <div className="sa-summary-item">
                <span>Free Rides (Membership)</span>
                <strong>{rides.filter(r => r.totalAmount === 0).length}</strong>
              </div>
              <div className="sa-summary-item">
                <span>Deposits Forfeited</span>
                <strong>{rides.filter(r => r.depositStatus === 'FORFEITED').length}</strong>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StationAnalytics;