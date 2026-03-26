import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Plus, Search, X, MapPin, Clock, Bike, BarChart3, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import { stationService } from '../../service/adminDashboardService';
import '../../style/admin/stationmanagement.css';
import AdminNavbar from './AdminNavbar';

const AdminStationManagement = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationDetails, setShowStationDetails] = useState(false);
  const [showAddStation, setShowAddStation] = useState(false);
  const [showEditStation, setShowEditStation] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [actionLoading, setActionLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const [addForm, setAddForm] = useState({
    stationName: '', stationAddress: '', latitude: '', longitude: '',
    totalCapacity: '', stationType: 'Standard', operatingHours: '24/7',
    contactNumber: '', status: 'Active'
  });
  const [editForm, setEditForm] = useState({});

  const loadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stationService.getAll();
      setStations(Array.isArray(data) ? data : data.content || data.data || []);
    } catch (err) {
      setError('Failed to load stations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStations(); }, []);

  const stats = {
    total: stations.length,
    active: stations.filter(s => s.status === 'Active').length,
    inactive: stations.filter(s => s.status === 'Inactive').length,
    totalCapacity: stations.reduce((sum, s) => sum + (s.totalCapacity || 0), 0),
    totalAvailable: stations.reduce((sum, s) => sum + (s.availableCycles || 0), 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeClass = (type) => (type || '').toLowerCase().replace(/\s+/g, '-');

  const filtered = stations.filter(s => {
    const matchSearch = [s.stationName, s.stationAddress, String(s.stationId)].some(v =>
      (v || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchType = filterType === 'all' || s.stationType === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.stationName || '').localeCompare(b.stationName || '');
    if (sortBy === 'capacity') return (b.totalCapacity || 0) - (a.totalCapacity || 0);
    if (sortBy === 'available') return (b.availableCycles || 0) - (a.availableCycles || 0);
    return 0;
  });

  const handleAddStation = async () => {
    if (!addForm.stationName || !addForm.stationAddress) return alert('Name and Address are required');
    try {
      setActionLoading(true);
      await stationService.add(addForm);
      setShowAddStation(false);
      setAddForm({ stationName: '', stationAddress: '', latitude: '', longitude: '', totalCapacity: '', stationType: 'Standard', operatingHours: '24/7', contactNumber: '', status: 'Active' });
      await loadStations();
    } catch { alert('Failed to add station'); }
    finally { setActionLoading(false); }
  };

  const handleEditStation = async () => {
    try {
      setActionLoading(true);
      await stationService.update(selectedStation.stationId, editForm);
      setShowEditStation(false);
      await loadStations();
    } catch { alert('Failed to update station'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteStation = async (stationId) => {
    if (!window.confirm('Delete this station? This cannot be undone.')) return;
    try {
      await stationService.delete(stationId);
      await loadStations();
    } catch { alert('Failed to delete station'); }
  };

  const handleToggleStatus = async (station) => {
    const newStatus = station.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await stationService.update(station.stationId, { ...station, status: newStatus });
      await loadStations();
    } catch { alert('Failed to update status'); }
  };

  const openEdit = (station) => {
    setSelectedStation(station);
    setEditForm({
      stationName: station.stationName, stationAddress: station.stationAddress,
      totalCapacity: station.totalCapacity, operatingHours: station.operatingHours,
      contactNumber: station.contactNumber, stationType: station.stationType,
      status: station.status, latitude: station.latitude, longitude: station.longitude,
    });
    setShowEditStation(true);
  };

  return (
    <div className="station-fleet-page">
      <AdminNavbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} />

      <div className={`station-management ${isNavCollapsed ? 'navbar-collapsed' : ''}`}>

        {/* ── Header — always visible ── */}
        <div className="sm-page-header">
          <div className="sm-header-inner">
            <div className="sm-title-block">
              <h1 className="sm-title"><MapPin size={26} className="sm-title-icon" />Station Management</h1>
              <p className="sm-subtitle">Monitor and manage all cycle rental stations across Ahmedabad</p>
            </div>
            <div className="sm-header-actions">
              <button className="sm-btn-add" onClick={() => setShowAddStation(true)}>
                <Plus size={17} /> Add Station
              </button>
              <button className="sm-btn-refresh" onClick={loadStations}>
                <RefreshCw size={17} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats — always visible ── */}
        <div className="sm-stats-grid">
          {[
            { label: 'Total Stations', value: stats.total,         icon: <BarChart3 size={20} />,   cls: 'total',    detail: 'Across city' },
            { label: 'Active',         value: stats.active,        icon: <CheckCircle size={20} />, cls: 'active',   detail: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% operational` },
            { label: 'Inactive',       value: stats.inactive,      icon: <XCircle size={20} />,     cls: 'inactive', detail: 'Currently offline' },
            { label: 'Total Capacity', value: stats.totalCapacity, icon: <Bike size={20} />,        cls: 'capacity', detail: `${stats.totalAvailable} available now` },
          ].map(s => (
            <div key={s.label} className={`sm-stat-card sm-stat-${s.cls}`}>
              <div className="sm-stat-icon">{s.icon}</div>
              <div className="sm-stat-body">
                <span className="sm-stat-label">{s.label}</span>
                <span className="sm-stat-value">{s.value}</span>
                <span className="sm-stat-detail">{s.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Controls — always visible ── */}
        <div className="sm-controls">
          <div className="sm-controls-row">
            <div className="sm-search">
              <Search size={16} className="sm-search-icon" />
              <input
                type="text"
                placeholder="Search by name, ID, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className="sm-clear" onClick={() => setSearchQuery('')}><X size={15} /></button>}
            </div>
            <div className="sm-filters">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name ↑</option>
                <option value="capacity">Capacity ↓</option>
                <option value="available">Available ↓</option>
              </select>
              <div className="sm-view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
              </div>
            </div>
          </div>
          <p className="sm-results-info">Showing {sorted.length} of {stations.length} stations</p>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="sm-loading">
            <RefreshCw size={34} className="sm-spin" />
            <p>Loading stations...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="sm-error">
            <AlertTriangle size={34} />
            <p>{error}</p>
            <button onClick={loadStations} className="sm-retry">Retry</button>
          </div>
        )}

        {/* ── Main Content ── */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="sm-grid">
                {sorted.map((station, i) => (
                  <div key={station.stationId} className="sm-card" style={{ animationDelay: `${i * 0.04}s` }}>

                    {/* gradient header strip — compact */}
                    <div className="sm-card-header">
                      <span className="sm-id-badge">#{station.stationId}</span>
                      <span className="sm-status-pill" style={{ backgroundColor: getStatusColor(station.status) }}>
                        {station.status}
                      </span>
                    </div>

                    {/* map image area — compact height */}
                    <div className="sm-card-img">
                      <MapPin size={30} className="sm-card-map-icon" />
                    </div>

                    {/* card content */}
                    <div className="sm-card-body">
                      <h3 className="sm-card-name">{station.stationName}</h3>
                      <p className="sm-card-address">{station.stationAddress}</p>

                      {station.stationType && (
                        <span className={`sm-type-badge sm-type-${getTypeClass(station.stationType)}`}>
                          {station.stationType}
                        </span>
                      )}

                      {/* capacity bar */}
                      <div className="sm-cap-block">
                        <div className="sm-cap-track">
                          <div
                            className="sm-cap-fill"
                            style={{ width: station.totalCapacity ? `${Math.min((station.availableCycles / station.totalCapacity) * 100, 100)}%` : '0%' }}
                          />
                        </div>
                        <div className="sm-cap-row">
                          <span className="sm-avail-label"><span className="sm-green-dot" />{station.availableCycles || 0} Available</span>
                          <span className="sm-cap-label">Cap: {station.totalCapacity || 0}</span>
                        </div>
                      </div>

                      {/* footer */}
                      <div className="sm-card-footer">
                        <span className="sm-hours"><Clock size={12} /> {station.operatingHours || 'N/A'}</span>
                        <div className="sm-card-actions">
                          <button className="sm-icon-btn sm-view" title="View" onClick={() => { setSelectedStation(station); setShowStationDetails(true); }}><Eye size={13} /></button>
                          <button className="sm-icon-btn sm-edit" title="Edit" onClick={() => openEdit(station)}><Edit size={13} /></button>
                          <button className="sm-icon-btn sm-del" title="Delete" onClick={() => handleDeleteStation(station.stationId)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sm-table-wrap">
                <table className="sm-table">
                  <thead>
                    <tr>
                      <th>Station</th><th>Type</th><th>Status</th>
                      <th>Capacity</th><th>Available</th><th>Hours</th><th>Contact</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(station => (
                      <tr key={station.stationId}>
                        <td>
                          <strong>{station.stationName}</strong>
                          <span className="sm-tbl-id"> #{station.stationId}</span>
                        </td>
                        <td><span className={`sm-type-badge sm-type-${getTypeClass(station.stationType)}`}>{station.stationType || 'N/A'}</span></td>
                        <td><span className="sm-tbl-status" style={{ backgroundColor: getStatusColor(station.status) }}>{station.status}</span></td>
                        <td>{station.totalCapacity || 0}</td>
                        <td className="sm-tbl-avail">{station.availableCycles || 0}</td>
                        <td>{station.operatingHours || 'N/A'}</td>
                        <td>{station.contactNumber || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="sm-tbl-btn" onClick={() => { setSelectedStation(station); setShowStationDetails(true); }}><Eye size={14} /></button>
                            <button className="sm-tbl-btn" onClick={() => openEdit(station)}><Edit size={14} /></button>
                            <button className="sm-tbl-btn sm-tbl-del" onClick={() => handleDeleteStation(station.stationId)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sorted.length === 0 && (
              <div className="sm-empty">
                <MapPin size={48} />
                <h3>No stations found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}

        {/* ── Details Modal ── */}
        {showStationDetails && selectedStation && (
          <div className="sm-overlay" onClick={() => setShowStationDetails(false)}>
            <div className="sm-modal sm-modal-lg" onClick={e => e.stopPropagation()}>
              <div className="sm-modal-grad-header">
                <div>
                  <h2>{selectedStation.stationName}</h2>
                  <span className="sm-modal-subid">#{selectedStation.stationId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="sm-modal-status" style={{ backgroundColor: getStatusColor(selectedStation.status) }}>{selectedStation.status}</span>
                  <button className="sm-modal-close" onClick={() => setShowStationDetails(false)}><X size={18} /></button>
                </div>
              </div>
              <div className="sm-modal-details-grid">
                <div className="sm-detail-section">
                  <h3>📍 Location</h3>
                  {[['Address', selectedStation.stationAddress], ['Coordinates', `${selectedStation.latitude || 'N/A'}, ${selectedStation.longitude || 'N/A'}`], ['Operating Hours', selectedStation.operatingHours || 'N/A'], ['Contact', selectedStation.contactNumber || 'N/A']].map(([l, v]) => (
                    <div className="sm-detail-row" key={l}><span className="sm-dl">{l}:</span><span className="sm-dv">{v}</span></div>
                  ))}
                </div>
                <div className="sm-detail-section">
                  <h3>🚴 Fleet</h3>
                  {[['Total Capacity', `${selectedStation.totalCapacity || 0} cycles`], ['Available', `${selectedStation.availableCycles || 0} cycles`], ['Type', selectedStation.stationType || 'N/A']].map(([l, v]) => (
                    <div className="sm-detail-row" key={l}><span className="sm-dl">{l}:</span><span className="sm-dv">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="sm-modal-footer">
                <button className="sm-btn-sec" onClick={() => setShowStationDetails(false)}>Close</button>
                <button className="sm-btn-pri" onClick={() => { setShowStationDetails(false); openEdit(selectedStation); }}><Edit size={14} /> Edit</button>
                <button className="sm-btn-action" onClick={() => { handleToggleStatus(selectedStation); setShowStationDetails(false); }}>
                  {selectedStation.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Modal ── */}
        {showAddStation && (
          <div className="sm-overlay" onClick={() => setShowAddStation(false)}>
            <div className="sm-modal sm-modal-form" onClick={e => e.stopPropagation()}>
              <div className="sm-modal-plain-header">
                <h2>Add New Station</h2>
                <button className="sm-modal-close plain" onClick={() => setShowAddStation(false)}><X size={18} /></button>
              </div>
              <div className="sm-modal-form-body">
                <div className="sm-form-grid">
                  <div className="sm-form-group"><label>Station Name *</label><input type="text" placeholder="e.g. Satellite Station" value={addForm.stationName} onChange={e => setAddForm({ ...addForm, stationName: e.target.value })} /></div>
                  <div className="sm-form-group sm-span2"><label>Address *</label><input type="text" placeholder="Full address" value={addForm.stationAddress} onChange={e => setAddForm({ ...addForm, stationAddress: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Latitude</label><input type="text" placeholder="23.0225" value={addForm.latitude} onChange={e => setAddForm({ ...addForm, latitude: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Longitude</label><input type="text" placeholder="72.5714" value={addForm.longitude} onChange={e => setAddForm({ ...addForm, longitude: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Total Capacity</label><input type="number" placeholder="50" value={addForm.totalCapacity} onChange={e => setAddForm({ ...addForm, totalCapacity: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Station Type</label>
                    <select value={addForm.stationType} onChange={e => setAddForm({ ...addForm, stationType: e.target.value })}>
                      <option>Standard</option><option>Premium</option><option>Outdoor</option><option>Smart Station</option>
                    </select>
                  </div>
                  <div className="sm-form-group"><label>Operating Hours</label><input type="text" placeholder="24/7" value={addForm.operatingHours} onChange={e => setAddForm({ ...addForm, operatingHours: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Contact Number</label><input type="tel" placeholder="+91 79 XXXX XXXX" value={addForm.contactNumber} onChange={e => setAddForm({ ...addForm, contactNumber: e.target.value })} /></div>
                </div>
              </div>
              <div className="sm-modal-footer">
                <button className="sm-btn-sec" onClick={() => setShowAddStation(false)}>Cancel</button>
                <button className="sm-btn-pri" onClick={handleAddStation} disabled={actionLoading}><Plus size={14} />{actionLoading ? 'Adding...' : 'Add Station'}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Modal ── */}
        {showEditStation && selectedStation && (
          <div className="sm-overlay" onClick={() => setShowEditStation(false)}>
            <div className="sm-modal sm-modal-form" onClick={e => e.stopPropagation()}>
              <div className="sm-modal-plain-header">
                <h2>Edit — {selectedStation.stationName}</h2>
                <button className="sm-modal-close plain" onClick={() => setShowEditStation(false)}><X size={18} /></button>
              </div>
              <div className="sm-modal-form-body">
                <div className="sm-form-grid">
                  <div className="sm-form-group"><label>Station Name</label><input type="text" value={editForm.stationName || ''} onChange={e => setEditForm({ ...editForm, stationName: e.target.value })} /></div>
                  <div className="sm-form-group sm-span2"><label>Address</label><input type="text" value={editForm.stationAddress || ''} onChange={e => setEditForm({ ...editForm, stationAddress: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Total Capacity</label><input type="number" value={editForm.totalCapacity || ''} onChange={e => setEditForm({ ...editForm, totalCapacity: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Station Type</label>
                    <select value={editForm.stationType || ''} onChange={e => setEditForm({ ...editForm, stationType: e.target.value })}>
                      <option>Standard</option><option>Premium</option><option>Outdoor</option><option>Smart Station</option>
                    </select>
                  </div>
                  <div className="sm-form-group"><label>Operating Hours</label><input type="text" value={editForm.operatingHours || ''} onChange={e => setEditForm({ ...editForm, operatingHours: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Contact Number</label><input type="tel" value={editForm.contactNumber || ''} onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })} /></div>
                  <div className="sm-form-group"><label>Status</label>
                    <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                      <option value="Active">Active</option><option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="sm-modal-footer">
                <button className="sm-btn-sec" onClick={() => setShowEditStation(false)}>Cancel</button>
                <button className="sm-btn-pri" onClick={handleEditStation} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminStationManagement;