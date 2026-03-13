import React, { useState, useEffect } from 'react';
import {
  Bike, Search, Filter, Plus, Trash2, Edit, Eye,
  CheckCircle, AlertTriangle, Wrench, TrendingUp,
  BarChart3, Activity, MapPin, Clock,
  ChevronDown, X, RefreshCw
} from 'lucide-react';
import { cycleService, stationService } from '../../service/adminDashboardService';
import '../../style/admin/cyclefleetmanagement.css';
import AdminNavbar from './AdminNavbar';

const CycleFleetManagement = () => {
  const [cycles, setCycles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [showEditCycle, setShowEditCycle] = useState(false);
  const [showCycleDetails, setShowCycleDetails] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('cycleName');
  const [actionLoading, setActionLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const [addForm, setAddForm] = useState({
    cycleName: '', cycleType: 'Non-Gear', cycleBrand: '',
    cycleModel: '', currentStationId: '', qrCode: '', purchaseDate: ''
  });
  const [editForm, setEditForm] = useState({});
  const [transferStationId, setTransferStationId] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cyclesData, stationsData] = await Promise.all([
        cycleService.getAll(),
        stationService.getAll()
      ]);
      setCycles(Array.isArray(cyclesData) ? cyclesData : cyclesData.content || cyclesData.data || []);
      setStations(Array.isArray(stationsData) ? stationsData : stationsData.content || stationsData.data || []);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const fleetStats = {
    total: cycles.length,
    available: cycles.filter(c => c.currentStatus === 'Available').length,
    rented: cycles.filter(c => c.currentStatus === 'Rented').length,
    maintenance: cycles.filter(c => c.currentStatus === 'Under_Maintenance').length,
    damaged: cycles.filter(c => c.currentStatus === 'Damaged').length,
    totalRides: cycles.reduce((sum, c) => sum + (c.totalRides || 0), 0),
  };

  const getStationName = (stationId) => {
    if (!stationId) return 'Unassigned';
    const s = stations.find(s => s.stationId === stationId || s.stationId === Number(stationId));
    return s ? s.stationName : `Station ${stationId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10b981';
      case 'Rented': return '#3b82f6';
      case 'Under_Maintenance': return '#f59e0b';
      case 'Damaged': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircle size={14} />;
      case 'Rented': return <Activity size={14} />;
      case 'Under_Maintenance': return <Wrench size={14} />;
      case 'Damaged': return <AlertTriangle size={14} />;
      default: return null;
    }
  };

  const formatStatus = (status) => status?.replace('_', ' ') || 'Unknown';

  const filtered = cycles.filter(c => {
    const name = c.cycleName || '';
    const brand = c.cycleBrand || '';
    const qr = c.qrCode || '';
    const station = getStationName(c.currentStationId);
    const matchSearch = [name, brand, qr, station].some(v =>
      v.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchStatus = filterStatus === 'all' || c.currentStatus === filterStatus;
    const matchType = filterType === 'all' || c.cycleType === filterType;
    const matchStation = filterStation === 'all' || String(c.currentStationId) === filterStation;
    return matchSearch && matchStatus && matchType && matchStation;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'cycleName') return (a.cycleName || '').localeCompare(b.cycleName || '');
    if (sortBy === 'rides') return (b.totalRides || 0) - (a.totalRides || 0);
    if (sortBy === 'status') return (a.currentStatus || '').localeCompare(b.currentStatus || '');
    return 0;
  });

  const handleAddCycle = async () => {
    if (!addForm.cycleName || !addForm.cycleBrand) return alert('Name and Brand are required');
    try {
      setActionLoading(true);
      await cycleService.add(addForm);
      setShowAddCycle(false);
      setAddForm({ cycleName: '', cycleType: 'Non-Gear', cycleBrand: '', cycleModel: '', currentStationId: '', qrCode: '', purchaseDate: '' });
      await loadData();
    } catch (err) { alert('Failed to add cycle'); }
    finally { setActionLoading(false); }
  };

  const handleEditCycle = async () => {
    try {
      setActionLoading(true);
      await cycleService.update(selectedCycle.cycleId, editForm);
      setShowEditCycle(false);
      await loadData();
    } catch (err) { alert('Failed to update cycle'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteCycle = async (cycleId) => {
    if (!window.confirm('Delete this cycle? This cannot be undone.')) return;
    try {
      await cycleService.delete(cycleId);
      await loadData();
    } catch (err) { alert('Failed to delete cycle'); }
  };

  const handleUpdateStatus = async (cycleId, status) => {
    try {
      await cycleService.updateStatus(cycleId, status);
      await loadData();
    } catch (err) { alert('Failed to update status'); }
  };

  const handleTransfer = async () => {
    if (!transferStationId) return alert('Select a station');
    try {
      setActionLoading(true);
      await cycleService.transfer(selectedCycle.cycleId, transferStationId);
      setShowTransferModal(false);
      await loadData();
    } catch (err) { alert('Failed to transfer cycle'); }
    finally { setActionLoading(false); }
  };

  const openEdit = (cycle) => {
    setSelectedCycle(cycle);
    setEditForm({
      cycleName: cycle.cycleName,
      cycleType: cycle.cycleType,
      cycleBrand: cycle.cycleBrand,
      cycleModel: cycle.cycleModel,
    });
    setShowEditCycle(true);
  };

  const cycleTypes = [...new Set(cycles.map(c => c.cycleType).filter(Boolean))];

  return (
    <div className="cycle-fleet-page">
      <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />

      <div className={`cycle-fleet-management ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>

        {/* Header — always visible */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="page-title"><Bike className="title-icon" /> Cycle Fleet Management</h1>
              <p className="page-subtitle">Manage and monitor your entire cycle fleet across all stations</p>
            </div>
            <div className="header-actions">
              <button className="add-cycle-btn" onClick={() => setShowAddCycle(true)}>
                <Plus size={20} /> Add New Cycle
              </button>
              <button className="export-btn" onClick={loadData}>
                <RefreshCw size={20} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats — always visible */}
        <div className="stats-grid">
          {[
            { label: 'Total Fleet', value: fleetStats.total, icon: <Bike size={24} />, cls: 'total' },
            { label: 'Available', value: fleetStats.available, icon: <CheckCircle size={24} />, cls: 'available', detail: `${fleetStats.total ? ((fleetStats.available / fleetStats.total) * 100).toFixed(0) : 0}% of fleet` },
            { label: 'Currently Rented', value: fleetStats.rented, icon: <Activity size={24} />, cls: 'rented' },
            { label: 'In Maintenance', value: fleetStats.maintenance, icon: <Wrench size={24} />, cls: 'maintenance' },
            { label: 'Damaged', value: fleetStats.damaged, icon: <AlertTriangle size={24} />, cls: 'damaged' },
            { label: 'Total Rides', value: fleetStats.totalRides, icon: <BarChart3 size={24} />, cls: 'rides', detail: `Avg: ${fleetStats.total ? (fleetStats.totalRides / fleetStats.total).toFixed(0) : 0} per cycle` },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div className="stat-icon-wrapper">{s.icon}</div>
              <div className="stat-content">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
                {s.detail && <span className="stat-detail">{s.detail}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Controls — always visible */}
        <div className="controls-section">
          <div className="controls-row">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by name, brand, QR code, or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}><X size={18} /></button>}
            </div>
            <div className="control-buttons">
              <button className={`filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                <Filter size={18} /> Filters <ChevronDown size={14} />
              </button>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="cycleName">Sort by Name</option>
                <option value="rides">Sort by Rides</option>
                <option value="status">Sort by Status</option>
              </select>
              <div className="view-toggle">
                <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>Grid</button>
                <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Under_Maintenance">Under Maintenance</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  {cycleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Station</label>
                <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)}>
                  <option value="all">All Stations</option>
                  {stations.map(s => (
                    <option key={s.stationId} value={String(s.stationId)}>{s.stationName}</option>
                  ))}
                </select>
              </div>
              <button className="reset-filters" onClick={() => { setFilterStatus('all'); setFilterType('all'); setFilterStation('all'); }}>
                Reset Filters
              </button>
            </div>
          )}

          <div className="results-info">Showing {sorted.length} of {cycles.length} cycles</div>
        </div>

        {/* Loading state — inside layout */}
        {loading && (
          <div className="loading-state">
            <RefreshCw size={36} className="spin-icon" />
            <p>Loading fleet data...</p>
          </div>
        )}

        {/* Error state — inside layout */}
        {error && !loading && (
          <div className="error-state">
            <AlertTriangle size={36} />
            <p>{error}</p>
            <button onClick={loadData} className="retry-btn">Retry</button>
          </div>
        )}

        {/* Main content — only when loaded */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="cycles-grid">
                {sorted.map((cycle, index) => (
                  <div key={cycle.cycleId} className="cycle-card" style={{ animationDelay: `${index * 0.03}s` }}>
                    <div className="card-header">
                      <span className="cycle-id-badge">#{cycle.cycleId}</span>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(cycle.currentStatus) }}>
                        {getStatusIcon(cycle.currentStatus)} {formatStatus(cycle.currentStatus)}
                      </span>
                    </div>
                    <div className="cycle-image-placeholder"><Bike size={36} /></div>
                    <div className="cycle-info">
                      <h3 className="cycle-name">{cycle.cycleName || 'Unnamed Cycle'}</h3>
                      <div className="cycle-tags">
                        <span className="tag type">{cycle.cycleType}</span>
                        <span className="tag brand">{cycle.cycleBrand}</span>
                      </div>
                      <div className="cycle-location">
                        <MapPin size={14} /><span>{getStationName(cycle.currentStationId)}</span>
                      </div>
                      <div className="cycle-metrics">
                        <div className="metric">
                          <TrendingUp size={14} />
                          <div>
                            <span className="metric-value">{cycle.totalRides || 0}</span>
                            <span className="metric-label">Rides</span>
                          </div>
                        </div>
                        <div className="metric">
                          <Clock size={14} />
                          <div>
                            <span className="metric-value" style={{ fontSize: '0.72rem' }}>{cycle.nextServiceDate || 'N/A'}</span>
                            <span className="metric-label">Next Service</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="action-btn view" title="View Details" onClick={() => { setSelectedCycle(cycle); setShowCycleDetails(true); }}>
                        <Eye size={15} />
                      </button>
                      <button className="action-btn edit" title="Edit" onClick={() => openEdit(cycle)}>
                        <Edit size={15} />
                      </button>
                      <button className="action-btn transfer" title="Transfer Station" onClick={() => { setSelectedCycle(cycle); setTransferStationId(''); setShowTransferModal(true); }}>
                        <MapPin size={15} />
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => handleDeleteCycle(cycle.cycleId)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cycles-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Type</th><th>Brand</th>
                      <th>Station</th><th>Status</th><th>Rides</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(cycle => (
                      <tr key={cycle.cycleId}>
                        <td className="cycle-id-cell">#{cycle.cycleId}</td>
                        <td className="cycle-name-cell">
                          <strong>{cycle.cycleName}</strong>
                          <span className="brand-text">{cycle.cycleModel}</span>
                        </td>
                        <td>{cycle.cycleType}</td>
                        <td>{cycle.cycleBrand}</td>
                        <td className="station-cell"><MapPin size={14} />{getStationName(cycle.currentStationId)}</td>
                        <td>
                          <span className="status-badge-table" style={{ backgroundColor: getStatusColor(cycle.currentStatus) }}>
                            {formatStatus(cycle.currentStatus)}
                          </span>
                        </td>
                        <td className="rides-cell">{cycle.totalRides || 0}</td>
                        <td className="actions-cell">
                          <button className="table-action-btn" onClick={() => { setSelectedCycle(cycle); setShowCycleDetails(true); }}><Eye size={15} /></button>
                          <button className="table-action-btn" onClick={() => openEdit(cycle)}><Edit size={15} /></button>
                          <button className="table-action-btn" onClick={() => { setSelectedCycle(cycle); setTransferStationId(''); setShowTransferModal(true); }}><MapPin size={15} /></button>
                          <button className="table-action-btn danger" onClick={() => handleDeleteCycle(cycle.cycleId)}><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sorted.length === 0 && (
              <div className="empty-state">
                <Bike size={56} />
                <h3>No cycles found</h3>
                <p>Try adjusting your filters</p>
              </div>
            )}
          </>
        )}

        {/* ── Add Cycle Modal ── */}
        {showAddCycle && (
          <div className="modal-overlay" onClick={() => setShowAddCycle(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Cycle</h2>
                <button className="close-modal" onClick={() => setShowAddCycle(false)}><X size={22} /></button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Cycle Name *</label>
                    <input type="text" placeholder="e.g. City Cruiser Alpha" value={addForm.cycleName} onChange={e => setAddForm({ ...addForm, cycleName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Cycle Type</label>
                    <select value={addForm.cycleType} onChange={e => setAddForm({ ...addForm, cycleType: e.target.value })}>
                      <option value="Non-Gear">Non-Gear</option>
                      <option value="Gear">Gear</option>
                      <option value="Kids">Kids</option>
                      <option value="Women">Women</option>
                      <option value="City">City</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input type="text" placeholder="e.g. Trek" value={addForm.cycleBrand} onChange={e => setAddForm({ ...addForm, cycleBrand: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input type="text" placeholder="e.g. X-Caliber 8" value={addForm.cycleModel} onChange={e => setAddForm({ ...addForm, cycleModel: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Station</label>
                    <select value={addForm.currentStationId} onChange={e => setAddForm({ ...addForm, currentStationId: e.target.value })}>
                      <option value="">Select Station</option>
                      {stations.map(s => <option key={s.stationId} value={s.stationId}>{s.stationName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>QR Code</label>
                    <input type="text" placeholder="QR-XXX-001" value={addForm.qrCode} onChange={e => setAddForm({ ...addForm, qrCode: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Purchase Date</label>
                    <input type="date" value={addForm.purchaseDate} onChange={e => setAddForm({ ...addForm, purchaseDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowAddCycle(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleAddCycle} disabled={actionLoading}>
                  <Plus size={15} />{actionLoading ? 'Adding...' : 'Add Cycle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Cycle Modal ── */}
        {showEditCycle && selectedCycle && (
          <div className="modal-overlay" onClick={() => setShowEditCycle(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Cycle #{selectedCycle.cycleId}</h2>
                <button className="close-modal" onClick={() => setShowEditCycle(false)}><X size={22} /></button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Cycle Name</label>
                    <input type="text" value={editForm.cycleName || ''} onChange={e => setEditForm({ ...editForm, cycleName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Cycle Type</label>
                    <select value={editForm.cycleType || ''} onChange={e => setEditForm({ ...editForm, cycleType: e.target.value })}>
                      <option value="Non-Gear">Non-Gear</option>
                      <option value="Gear">Gear</option>
                      <option value="Kids">Kids</option>
                      <option value="Women">Women</option>
                      <option value="City">City</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input type="text" value={editForm.cycleBrand || ''} onChange={e => setEditForm({ ...editForm, cycleBrand: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input type="text" value={editForm.cycleModel || ''} onChange={e => setEditForm({ ...editForm, cycleModel: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={editForm.currentStatus || selectedCycle.currentStatus} onChange={e => setEditForm({ ...editForm, currentStatus: e.target.value })}>
                      <option value="Available">Available</option>
                      <option value="Under_Maintenance">Under Maintenance</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowEditCycle(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleEditCycle} disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Transfer Modal ── */}
        {showTransferModal && selectedCycle && (
          <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Transfer — {selectedCycle.cycleName}</h2>
                <button className="close-modal" onClick={() => setShowTransferModal(false)}><X size={22} /></button>
              </div>
              <div className="modal-body">
                <p style={{ marginBottom: '12px', color: '#6b7280' }}>
                  Currently at: <strong>{getStationName(selectedCycle.currentStationId)}</strong>
                </p>
                <div className="form-group">
                  <label>Transfer to Station</label>
                  <select value={transferStationId} onChange={e => setTransferStationId(e.target.value)}>
                    <option value="">Select destination station</option>
                    {stations.filter(s => s.stationId !== selectedCycle.currentStationId).map(s => (
                      <option key={s.stationId} value={s.stationId}>{s.stationName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleTransfer} disabled={actionLoading}>
                  <MapPin size={15} />{actionLoading ? 'Transferring...' : 'Transfer Cycle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Details Modal ── */}
        {showCycleDetails && selectedCycle && (
          <div className="modal-overlay" onClick={() => setShowCycleDetails(false)}>
            <div className="modal-content details-modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCycle.cycleName}</h2>
                <button className="close-modal" onClick={() => setShowCycleDetails(false)}><X size={22} /></button>
              </div>
              <div className="details-grid">
                <div className="details-section">
                  <h3>Basic Information</h3>
                  {[['Cycle ID', `#${selectedCycle.cycleId}`], ['Type', selectedCycle.cycleType], ['Brand', selectedCycle.cycleBrand], ['Model', selectedCycle.cycleModel], ['QR Code', selectedCycle.qrCode]].map(([l, v]) => (
                    <div className="detail-row" key={l}>
                      <span className="detail-label">{l}:</span>
                      <span className="detail-value">{v || 'N/A'}</span>
                    </div>
                  ))}
                </div>
                <div className="details-section">
                  <h3>Status & Location</h3>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="status-badge-inline" style={{ backgroundColor: getStatusColor(selectedCycle.currentStatus) }}>
                      {formatStatus(selectedCycle.currentStatus)}
                    </span>
                  </div>
                  {[['Station', getStationName(selectedCycle.currentStationId)], ['Purchase Date', selectedCycle.purchaseDate], ['Next Service', selectedCycle.nextServiceDate]].map(([l, v]) => (
                    <div className="detail-row" key={l}>
                      <span className="detail-label">{l}:</span>
                      <span className="detail-value">{v || 'N/A'}</span>
                    </div>
                  ))}
                </div>
                <div className="details-section">
                  <h3>Performance</h3>
                  {[['Total Rides', selectedCycle.totalRides || 0], ['Service Interval', `${selectedCycle.serviceIntervalDays || 'N/A'} days`]].map(([l, v]) => (
                    <div className="detail-row" key={l}>
                      <span className="detail-label">{l}:</span>
                      <span className="detail-value">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="details-section">
                  <h3>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Available', 'Under_Maintenance', 'Damaged'].map(status => (
                      <button
                        key={status}
                        className="primary-btn"
                        style={{ opacity: selectedCycle.currentStatus === status ? 0.5 : 1, fontSize: '13px', padding: '8px 12px' }}
                        disabled={selectedCycle.currentStatus === status}
                        onClick={() => { handleUpdateStatus(selectedCycle.cycleId, status); setShowCycleDetails(false); }}
                      >
                        Set: {formatStatus(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowCycleDetails(false)}>Close</button>
                <button className="primary-btn" onClick={() => { setShowCycleDetails(false); openEdit(selectedCycle); }}>
                  <Edit size={15} /> Edit Cycle
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CycleFleetManagement;