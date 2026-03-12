import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, Bike, CheckCircle, Clock, X, RefreshCw, Calendar, ChevronDown, Activity } from 'lucide-react';
import EmpNavbar from './Empnavbar';
import {
  fetchAssignedCycles,
  fetchDueCycles,
  fetchAssignedDefects,
  completeMaintenanceService,
  updateCycleStatus,
  setNextServiceDate,
} from '../../service/employeeService';
import '../../style/employee/maintenancedashboard.css';

const CYCLE_TYPE_MAP = { '1': 'Non-Gear', '2': 'Gear', '3': 'Kids', '4': 'Women', '5': 'City', '6': 'Electric' };
const STATUS_COLORS  = { Available: 'st-available', Rented: 'st-rented', 'Under Maintenance': 'st-maint', Damaged: 'st-damaged', Retired: 'st-retired' };

const MaintenanceDashboard = () => {
  const [activeTab, setActiveTab]           = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading]               = useState(true);
  const [cycles, setCycles]                 = useState([]);
  const [dueCycles, setDueCycles]           = useState([]);
  const [defects, setDefects]               = useState([]);
  const [stationFilter, setStationFilter]   = useState('all');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDateModal, setShowDateModal]   = useState(false);
  const [selectedCycle, setSelectedCycle]   = useState(null);
  const [serviceForm, setServiceForm]       = useState({ partsReplaced: '', cost: '', newStatus: 'Available' });
  const [newServiceDate, setNewServiceDate] = useState('');
  const [currentTime, setCurrentTime]       = useState(new Date());

  const empId     = localStorage.getItem('staffId');
  const empName   = localStorage.getItem('staffName') || 'Maintenance Tech';
  const stationId = localStorage.getItem('stationId');

  // Derive assigned zone from empId or stored role
  const isZone1 = true; // Will show based on API data

  useEffect(() => { loadAll(); }, [empId]);
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadAll = async () => {
    if (!empId) return;
    setLoading(true);
    try {
      const [c, d, def] = await Promise.all([
        fetchAssignedCycles(empId),
        fetchDueCycles(empId),
        fetchAssignedDefects(empId),
      ]);
      setCycles(c || []);
      setDueCycles(d || []);
      setDefects(def || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Stats ──
  const stats = {
    total:       cycles.length,
    available:   cycles.filter(c => c.currentStatus === 'Available').length,
    maintenance: cycles.filter(c => c.currentStatus === 'Under Maintenance').length,
    damaged:     cycles.filter(c => c.currentStatus === 'Damaged').length,
    due:         dueCycles.length,
    defects:     defects.length,
  };

  // ── Unique stations ──
  const stations = [...new Set(cycles.map(c => c.currentStationId))].sort((a,b)=>a-b);

  // ── Filtered cycles ──
  const filteredCycles = cycles.filter(c => {
    if (stationFilter !== 'all' && String(c.currentStationId) !== stationFilter) return false;
    if (statusFilter !== 'all' && c.currentStatus !== statusFilter) return false;
    if (searchQuery && !c.cycleName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !CYCLE_TYPE_MAP[c.cycleType]?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ── Handlers ──
  const openServiceModal = (cycle) => { setSelectedCycle(cycle); setServiceForm({ partsReplaced: '', cost: '', newStatus: 'Available' }); setShowServiceModal(true); };
  const openDateModal    = (cycle) => {
    setSelectedCycle(cycle);
    const days = cycle.serviceIntervalDays || 30;
    const next = new Date(); next.setDate(next.getDate() + days);
    setNewServiceDate(next.toISOString().split('T')[0]);
    setShowDateModal(true);
  };

  const handleCompleteMaintenance = async (maintenanceId) => {
    if (!maintenanceId) return;
    try {
      await completeMaintenanceService(maintenanceId, empId, 'General service', 0);
      loadAll();
      alert('Maintenance marked complete!');
    } catch { alert('Failed to complete maintenance'); }
  };

  const handleServiceSubmit = async () => {
    if (!selectedCycle) return;
    try {
      await updateCycleStatus(selectedCycle.cycleId, serviceForm.newStatus);
      setShowServiceModal(false);
      loadAll();
    } catch { alert('Failed to update cycle'); }
  };

  const handleDateSubmit = async () => {
    if (!selectedCycle || !newServiceDate) return;
    try {
      await setNextServiceDate(selectedCycle.cycleId, newServiceDate);
      setShowDateModal(false);
      loadAll();
    } catch { alert('Failed to set service date'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
  const isOverdue = (d) => d && new Date(d) < new Date();
  const isDueSoon = (d) => { if (!d) return false; const diff = (new Date(d) - new Date()) / 86400000; return diff >= 0 && diff <= 7; };

  if (loading) return (
    <div className="md-page">
      <EmpNavbar onCollapse={setSidebarCollapsed} />
      <main className={`md-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="md-loading"><div className="md-spinner" /><p>Loading maintenance data...</p></div>
      </main>
    </div>
  );

  return (
    <div className="md-page">
      <EmpNavbar onCollapse={setSidebarCollapsed} />

      <main className={`md-main ${sidebarCollapsed ? 'collapsed' : ''}`}>

        {/* ── Header ── */}
        <div className="md-header">
          <div className="md-header-left">
            <div className="md-header-icon"><Wrench size={22} /></div>
            <div>
              <h1 className="md-title">Maintenance Dashboard</h1>
              <p className="md-subtitle">
                Welcome, {empName} · {currentTime.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
          </div>
          <button className="md-refresh-btn" onClick={loadAll}><RefreshCw size={15} /> Refresh</button>
        </div>

        {/* ── Stats Row ── */}
        <div className="md-stats-row">
          {[
            { label: 'Total Cycles',    value: stats.total,       icon: <Bike size={20} />,          cls: 'stat-total'   },
            { label: 'Available',       value: stats.available,   icon: <CheckCircle size={20} />,   cls: 'stat-avail'   },
            { label: 'Under Maint.',    value: stats.maintenance, icon: <Wrench size={20} />,        cls: 'stat-maint'   },
            { label: 'Damaged',         value: stats.damaged,     icon: <AlertTriangle size={20} />, cls: 'stat-damaged' },
            { label: 'Due for Service', value: stats.due,         icon: <Clock size={20} />,         cls: 'stat-due'     },
            { label: 'Defect Reports',  value: stats.defects,     icon: <Activity size={20} />,      cls: 'stat-defects' },
          ].map((s, i) => (
            <div key={i} className={`md-stat-card ${s.cls}`} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="md-stat-icon">{s.icon}</div>
              <div className="md-stat-body">
                <span className="md-stat-value">{s.value}</span>
                <span className="md-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="md-tabs">
          {[
            { key: 'overview',  label: '🏠 Overview'         },
            { key: 'cycles',    label: `🚲 All Cycles (${cycles.length})` },
            { key: 'due',       label: `⏰ Due for Service (${dueCycles.length})`, alert: dueCycles.length > 0 },
            { key: 'defects',   label: `🔧 Defect Reports (${defects.length})`,   alert: defects.length > 0  },
          ].map(t => (
            <button key={t.key} className={`md-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
              {t.alert && <span className="md-tab-dot" />}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === 'overview' && (
          <div className="md-tab-content">
            <div className="md-overview-grid">

              {/* Due for service alert */}
              {dueCycles.length > 0 && (
                <div className="md-alert-card">
                  <div className="md-alert-header">
                    <Clock size={18} /> <span>{dueCycles.length} Cycles Due for Service</span>
                  </div>
                  <div className="md-alert-list">
                    {dueCycles.slice(0, 5).map(c => (
                      <div key={c.cycleId} className="md-alert-row">
                        <div>
                          <strong>{c.cycleName}</strong>
                          <small>Station #{c.stationId} · Due: {fmtDate(c.nextMaintenanceDue)}</small>
                        </div>
                        <button className="md-btn-sm warning" onClick={() => { const cyc = cycles.find(x => x.cycleId === c.cycleId); if(cyc) openDateModal(cyc); }}>
                          Set Date
                        </button>
                      </div>
                    ))}
                    {dueCycles.length > 5 && <p className="md-more">+{dueCycles.length - 5} more · <button onClick={() => setActiveTab('due')}>View all</button></p>}
                  </div>
                </div>
              )}

              {/* Defect reports alert */}
              {defects.length > 0 && (
                <div className="md-alert-card danger">
                  <div className="md-alert-header danger">
                    <AlertTriangle size={18} /> <span>{defects.length} Defect Reports Pending</span>
                  </div>
                  <div className="md-alert-list">
                    {defects.slice(0, 5).map(d => (
                      <div key={d.maintenanceId} className="md-alert-row">
                        <div>
                          <strong>{d.cycleName}</strong>
                          <small>Station #{d.stationId} · {d.defectDescription || 'No description'}</small>
                        </div>
                        <button className="md-btn-sm danger" onClick={() => handleCompleteMaintenance(d.maintenanceId)}>
                          Resolve
                        </button>
                      </div>
                    ))}
                    {defects.length > 5 && <p className="md-more">+{defects.length - 5} more · <button onClick={() => setActiveTab('defects')}>View all</button></p>}
                  </div>
                </div>
              )}

              {/* Station breakdown */}
              <div className="md-station-breakdown">
                <h3>Station Breakdown</h3>
                <div className="md-station-list">
                  {stations.map(sid => {
                    const stCycles = cycles.filter(c => c.currentStationId === sid);
                    const avail    = stCycles.filter(c => c.currentStatus === 'Available').length;
                    const maint    = stCycles.filter(c => c.currentStatus === 'Under Maintenance').length;
                    const due      = dueCycles.filter(c => c.stationId === sid).length;
                    return (
                      <div key={sid} className="md-station-row">
                        <div className="md-station-info">
                          <span className="md-station-name">
                            {stCycles[0]?.stationName || `Station #${sid}`}
                          </span>
                          <span className="md-station-total">{stCycles.length} cycles</span>
                        </div>
                        <div className="md-station-pills">
                          <span className="pill green">{avail} OK</span>
                          {maint > 0 && <span className="pill orange">{maint} Maint</span>}
                          {due > 0 && <span className="pill red">{due} Due</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ALL CYCLES TAB ══════════════ */}
        {activeTab === 'cycles' && (
          <div className="md-tab-content">
            {/* Filters */}
            <div className="md-filters-row">
              <input className="md-search" placeholder="🔍 Search cycle name or type..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <select className="md-select" value={stationFilter} onChange={e => setStationFilter(e.target.value)}>
                <option value="all">All Stations</option>
                {stations.map(s => <option key={s} value={String(s)}>{cycles.find(c=>c.currentStationId===s)?.stationName || `Station #${s}`}</option>)}
              </select>
              <select className="md-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Damaged">Damaged</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            <div className="md-table-wrap">
              <table className="md-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cycle</th>
                    <th>Type</th>
                    <th>Station</th>
                    <th>Status</th>
                    <th>Total Rides</th>
                    <th>Next Service</th>
                    <th>Service Interval</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCycles.length === 0 ? (
                    <tr><td colSpan={9} className="md-empty">No cycles found</td></tr>
                  ) : filteredCycles.map((c, i) => (
                    <tr key={c.cycleId} className={isOverdue(c.nextServiceDate) ? 'row-overdue' : isDueSoon(c.nextServiceDate) ? 'row-due-soon' : ''}>
                      <td className="td-num">{i + 1}</td>
                      <td>
                        <div className="td-cycle-name">
                          <span className="cycle-badge">{c.cycleId}</span>
                          <strong>{c.cycleName}</strong>
                        </div>
                      </td>
                      <td><span className="type-badge">{CYCLE_TYPE_MAP[c.cycleType] || c.cycleType}</span></td>
                      <td className="td-station">{c.stationName || `Station #${c.currentStationId}`}</td>
                      <td><span className={`status-badge ${STATUS_COLORS[c.currentStatus] || ''}`}>{c.currentStatus}</span></td>
                      <td className="td-rides">{c.totalRides ?? 0}</td>
                      <td>
                        <div className={`td-date ${isOverdue(c.nextServiceDate) ? 'overdue' : isDueSoon(c.nextServiceDate) ? 'due-soon' : ''}`}>
                          {fmtDate(c.nextServiceDate)}
                          {isOverdue(c.nextServiceDate) && <span className="overdue-tag">Overdue</span>}
                          {isDueSoon(c.nextServiceDate) && <span className="soon-tag">Soon</span>}
                        </div>
                      </td>
                      <td className="td-interval">Every {c.serviceIntervalDays} days</td>
                      <td>
                        <div className="td-actions">
                          <button className="md-btn-sm primary" onClick={() => openServiceModal(c)} title="Update Status">
                            <Wrench size={13} /> Status
                          </button>
                          <button className="md-btn-sm secondary" onClick={() => openDateModal(c)} title="Set Service Date">
                            <Calendar size={13} /> Date
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ DUE FOR SERVICE TAB ══════════════ */}
        {activeTab === 'due' && (
          <div className="md-tab-content">
            {dueCycles.length === 0 ? (
              <div className="md-empty-state">
                <CheckCircle size={48} color="#10b981" />
                <h3>All cycles are up to date!</h3>
                <p>No cycles are due for service right now.</p>
              </div>
            ) : (
              <div className="md-due-grid">
                {dueCycles.map(c => {
                  const fullCycle = cycles.find(x => x.cycleId === c.cycleId);
                  return (
                    <div key={c.cycleId} className="md-due-card">
                      <div className="md-due-card-header">
                        <div>
                          <h4>{c.cycleName}</h4>
                          <span className="type-badge sm">{CYCLE_TYPE_MAP[c.cycleType] || c.cycleType}</span>
                        </div>
                        <span className="overdue-tag lg">Overdue</span>
                      </div>
                      <div className="md-due-card-body">
                        <div className="info-row"><span>Station</span><strong>{c.stationName || `#${c.stationId}`}</strong></div>
                        <div className="info-row"><span>Due Date</span><strong className="red">{fmtDate(c.nextMaintenanceDue)}</strong></div>
                        <div className="info-row"><span>Status</span><span className={`status-badge sm ${STATUS_COLORS[fullCycle?.currentStatus] || ''}`}>{fullCycle?.currentStatus || '—'}</span></div>
                        <div className="info-row"><span>Total Rides</span><strong>{fullCycle?.totalRides ?? 0}</strong></div>
                      </div>
                      <div className="md-due-card-actions">
                        {fullCycle && (
                          <>
                            <button className="md-btn-sm warning full" onClick={() => openServiceModal(fullCycle)}>
                              <Wrench size={13} /> Update Status
                            </button>
                            <button className="md-btn-sm secondary full" onClick={() => openDateModal(fullCycle)}>
                              <Calendar size={13} /> Set Next Service Date
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ DEFECTS TAB ══════════════ */}
        {activeTab === 'defects' && (
          <div className="md-tab-content">
            {defects.length === 0 ? (
              <div className="md-empty-state">
                <CheckCircle size={48} color="#10b981" />
                <h3>No defect reports!</h3>
                <p>No station employee has reported any defects.</p>
              </div>
            ) : (
              <div className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cycle</th>
                      <th>Type</th>
                      <th>Station</th>
                      <th>Defect Description</th>
                      <th>Reported By</th>
                      <th>Report Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defects.map((d, i) => (
                      <tr key={d.maintenanceId}>
                        <td className="td-num">{i + 1}</td>
                        <td><strong>{d.cycleName}</strong></td>
                        <td><span className="type-badge">{CYCLE_TYPE_MAP[d.cycleType] || d.cycleType}</span></td>
                        <td className="td-station">{d.stationName || `Station #${d.stationId}`}</td>
                        <td className="td-desc">{d.defectDescription || '—'}</td>
                        <td>{d.reportedByEmpName || '—'}</td>
                        <td>{fmtDate(d.maintenanceDate)}</td>
                        <td>
                          <span className={`status-badge ${d.reportStatus === 'Reported' ? 'st-damaged' : d.reportStatus === 'Completed' ? 'st-available' : 'st-maint'}`}>
                            {d.reportStatus}
                          </span>
                        </td>
                        <td>
                          <div className="td-actions">
                            {d.reportStatus !== 'Completed' && (
                              <>
                                <button className="md-btn-sm primary" onClick={() => {
                                  const cyc = cycles.find(x => x.cycleId === d.cycleId);
                                  if (cyc) openServiceModal(cyc);
                                }}>
                                  <Wrench size={13} /> Fix
                                </button>
                                <button className="md-btn-sm success" onClick={() => handleCompleteMaintenance(d.maintenanceId)}>
                                  <CheckCircle size={13} /> Done
                                </button>
                              </>
                            )}
                            {d.reportStatus === 'Completed' && <span className="resolved-tag">✅ Resolved</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════ UPDATE STATUS MODAL ══════════════ */}
      {showServiceModal && selectedCycle && (
        <div className="md-modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="md-modal" onClick={e => e.stopPropagation()}>
            <button className="md-modal-close" onClick={() => setShowServiceModal(false)}><X size={18} /></button>
            <h3>🔧 Update Cycle Status</h3>
            <p className="md-modal-cycle">{selectedCycle.cycleName} · {CYCLE_TYPE_MAP[selectedCycle.cycleType]}</p>
            <div className="md-modal-body">
              <label>Current Status</label>
              <span className={`status-badge ${STATUS_COLORS[selectedCycle.currentStatus]}`}>{selectedCycle.currentStatus}</span>

              <label>New Status</label>
              <select className="md-select full" value={serviceForm.newStatus} onChange={e => setServiceForm({...serviceForm, newStatus: e.target.value})}>
                <option value="Available">Available</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Damaged">Damaged</option>
                <option value="Retired">Retired</option>
              </select>

              <label>Parts Replaced (optional)</label>
              <input className="md-input" placeholder="e.g. Brake pads, chain..." value={serviceForm.partsReplaced} onChange={e => setServiceForm({...serviceForm, partsReplaced: e.target.value})} />

              <label>Service Cost (₹)</label>
              <input className="md-input" type="number" placeholder="0" value={serviceForm.cost} onChange={e => setServiceForm({...serviceForm, cost: e.target.value})} />
            </div>
            <div className="md-modal-footer">
              <button className="md-btn primary full" onClick={handleServiceSubmit}>✅ Update Status</button>
              <button className="md-btn secondary full" onClick={() => setShowServiceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SET SERVICE DATE MODAL ══════════════ */}
      {showDateModal && selectedCycle && (
        <div className="md-modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="md-modal" onClick={e => e.stopPropagation()}>
            <button className="md-modal-close" onClick={() => setShowDateModal(false)}><X size={18} /></button>
            <h3>📅 Set Next Service Date</h3>
            <p className="md-modal-cycle">{selectedCycle.cycleName} · Service every {selectedCycle.serviceIntervalDays} days</p>
            <div className="md-modal-body">
              <label>Current Next Service Date</label>
              <p className={isOverdue(selectedCycle.nextServiceDate) ? 'red bold' : ''}>{fmtDate(selectedCycle.nextServiceDate)}</p>

              <label>Set New Service Date</label>
              <input className="md-input" type="date" value={newServiceDate} onChange={e => setNewServiceDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />

              <div className="md-quick-dates">
                <span>Quick set:</span>
                {[7, 15, 30, selectedCycle.serviceIntervalDays].filter((v,i,a)=>a.indexOf(v)===i).map(days => (
                  <button key={days} className="md-btn-sm secondary" onClick={() => {
                    const d = new Date(); d.setDate(d.getDate() + days);
                    setNewServiceDate(d.toISOString().split('T')[0]);
                  }}>+{days}d</button>
                ))}
              </div>
            </div>
            <div className="md-modal-footer">
              <button className="md-btn primary full" onClick={handleDateSubmit}>📅 Save Date</button>
              <button className="md-btn secondary full" onClick={() => setShowDateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;