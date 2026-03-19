import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/axiosConfig';
import AdminNavbar from './AdminNavbar';
import '../../style/admin/revenuemanagement.css';

const RevenueManagement = () => {
  const [summary, setSummary]     = useState(null);
  const [stations, setStations]   = useState([]);
  const [monthly, setMonthly]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, stationsRes, monthlyRes] = await Promise.all([
        axiosInstance.get('/admin/revenue/summary'),
        axiosInstance.get('/admin/revenue/by-station'),
        axiosInstance.get('/admin/revenue/monthly'),
      ]);
      setSummary(summaryRes.data);
      setStations(Array.isArray(stationsRes.data) ? stationsRes.data : []);
      setMonthly(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
    } catch (err) {
      setError('Failed to load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const maxRevenue = stations.length > 0 ? Math.max(...stations.map(s => s.totalRevenue || 0)) : 1;
  const maxMonthly = monthly.length > 0 ? Math.max(...monthly.map(m => m.revenue || 0)) : 1;

  return (
    <div className="rev-page">
      <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />
      <div className={`rev-content ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>

        {/* Header */}
        <div className="rev-header">
          <div>
            <h1>💰 Revenue Management</h1>
            <p>Complete financial overview of SpinCity operations</p>
          </div>
          <button className="rev-refresh" onClick={loadAll}>🔄 Refresh</button>
        </div>

        {loading && <div className="rev-loading">Loading revenue data...</div>}
        {error && <div className="rev-error">{error} <button onClick={loadAll}>Retry</button></div>}

        {!loading && !error && summary && (
          <>
            {/* Summary Cards */}
            <div className="rev-summary-grid">
              {[
                { label: 'Total Revenue',    value: fmt(summary.totalRevenue),    icon: '💰', color: '#6366f1', sub: 'All time' },
                { label: "This Month",       value: fmt(summary.monthRevenue),    icon: '📅', color: '#10b981', sub: 'Current month' },
                { label: 'This Week',        value: fmt(summary.weekRevenue),     icon: '📊', color: '#3b82f6', sub: 'Last 7 days' },
                { label: "Today",            value: fmt(summary.todayRevenue),    icon: '🌅', color: '#f59e0b', sub: 'Today only' },
                { label: 'Total Rides',      value: summary.totalRides,           icon: '🚴', color: '#8b5cf6', sub: 'All time' },
                { label: 'Avg per Ride',     value: fmt(summary.avgRevenuePerRide), icon: '📈', color: '#06b6d4', sub: 'Average revenue' },
              ].map(c => (
                <div key={c.label} className="rev-card" style={{ borderTopColor: c.color }}>
                  <div className="rev-card-icon" style={{ background: c.color + '22' }}>{c.icon}</div>
                  <div className="rev-card-body">
                    <div className="rev-card-value" style={{ color: c.color }}>{c.value}</div>
                    <div className="rev-card-label">{c.label}</div>
                    <div className="rev-card-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Chart */}
            <div className="rev-section">
              <h2>📅 Monthly Revenue — Last 6 Months</h2>
              <div className="rev-chart">
                {monthly.map((m, i) => (
                  <div key={i} className="rev-bar-col">
                    <div className="rev-bar-amount">{fmt(m.revenue)}</div>
                    <div className="rev-bar-wrap">
                      <div
                        className="rev-bar-fill"
                        style={{ height: `${maxMonthly > 0 ? (m.revenue / maxMonthly) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="rev-bar-label">{m.month}</div>
                    <div className="rev-bar-rides">{m.rides} rides</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Station wise Revenue */}
            <div className="rev-section">
              <h2>📍 Station-wise Revenue</h2>
              {stations.length === 0 ? (
                <div className="rev-empty">No station data available</div>
              ) : (
                <div className="rev-station-list">
                  {/* Table Header */}
                  <div className="rev-station-header">
                    <span>Station</span>
                    <span>Total Revenue</span>
                    <span>Total Rides</span>
                    <span>Avg/Ride</span>
                    <span>Share</span>
                  </div>
                  {stations.map((s, i) => {
                    const pct = summary.totalRevenue > 0
                      ? ((s.totalRevenue / summary.totalRevenue) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={s.stationId} className="rev-station-row">
                        <div className="rev-station-name">
                          <span className="rev-rank">#{i + 1}</span>
                          <div>
                            <div className="rev-sname">{s.stationName}</div>
                            <div className="rev-sbar-wrap">
                              <div
                                className="rev-sbar-fill"
                                style={{ width: `${maxRevenue > 0 ? (s.totalRevenue / maxRevenue) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className="rev-amount">{fmt(s.totalRevenue)}</span>
                        <span className="rev-rides">{s.totalRides}</span>
                        <span className="rev-avg">{fmt(s.avgRevenue)}</span>
                        <span className="rev-pct">{pct}%</span>
                      </div>
                    );
                  })}

                  {/* Total Row */}
                  <div className="rev-station-total">
                    <span>All Stations Combined</span>
                    <span>{fmt(summary.totalRevenue)}</span>
                    <span>{summary.totalRides} rides</span>
                    <span>{fmt(summary.avgRevenuePerRide)}</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueManagement;