import React, { useState } from 'react';
import { 
  MapPin, Search, Filter, Edit, Eye, Clock, Phone,
  Bike, TrendingUp, TrendingDown, Users, DollarSign,
  AlertCircle, CheckCircle, XCircle, Navigation,
  RefreshCw, BarChart3, Calendar, Activity, Zap,
  ChevronDown, X, Plus, Minus, Settings, Download
} from 'lucide-react';
import '../../style/employee/stationmanagement.css';

const StationManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationDetails, setShowStationDetails] = useState(false);
  const [showUpdateCapacity, setShowUpdateCapacity] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock current station (assigned to employee)
  const currentStation = {
    station_id: 'STN001',
    station_name: 'Central Park Station',
    station_address: 'Central Park, Near Main Gate, Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    total_capacity: 50,
    available_cycles: 32,
    rented_cycles: 15,
    maintenance_cycles: 3,
    operating_hours: '06:00 AM - 10:00 PM',
    contact_number: '+91 98765 43210',
    station_type: 'Premium',
    status: 'operational',
    manager_name: 'Rajesh Kumar',
    last_updated: '2 mins ago',
    daily_rentals: 47,
    daily_revenue: 8450,
    occupancy_rate: 64,
    peak_hours: '08:00 AM - 10:00 AM, 05:00 PM - 07:00 PM'
  };

  // Mock nearby stations data
  const nearbyStations = [
    {
      station_id: 'STN002',
      station_name: 'Beach View Station',
      station_address: 'Marine Drive, Near Gateway, Mumbai',
      distance: '2.5 km',
      total_capacity: 40,
      available_cycles: 28,
      rented_cycles: 10,
      maintenance_cycles: 2,
      operating_hours: '06:00 AM - 11:00 PM',
      contact_number: '+91 98765 43211',
      station_type: 'Standard',
      status: 'operational',
      occupancy_rate: 70,
      daily_rentals: 38
    },
    {
      station_id: 'STN003',
      station_name: 'Mall Road Station',
      station_address: 'Phoenix Mall, Lower Parel, Mumbai',
      distance: '3.8 km',
      total_capacity: 60,
      available_cycles: 12,
      rented_cycles: 45,
      maintenance_cycles: 3,
      operating_hours: '08:00 AM - 12:00 AM',
      contact_number: '+91 98765 43212',
      station_type: 'Premium',
      status: 'low-capacity',
      occupancy_rate: 20,
      daily_rentals: 89
    },
    {
      station_id: 'STN004',
      station_name: 'University Station',
      station_address: 'Mumbai University, Fort, Mumbai',
      distance: '4.2 km',
      total_capacity: 45,
      available_cycles: 35,
      rented_cycles: 8,
      maintenance_cycles: 2,
      operating_hours: '06:00 AM - 09:00 PM',
      contact_number: '+91 98765 43213',
      station_type: 'Standard',
      status: 'operational',
      occupancy_rate: 78,
      daily_rentals: 32
    },
    {
      station_id: 'STN005',
      station_name: 'Tech Park Station',
      station_address: 'Hiranandani Tech Park, Powai, Mumbai',
      distance: '6.1 km',
      total_capacity: 55,
      available_cycles: 5,
      rented_cycles: 48,
      maintenance_cycles: 2,
      operating_hours: '06:00 AM - 10:00 PM',
      contact_number: '+91 98765 43214',
      station_type: 'Premium',
      status: 'critical',
      occupancy_rate: 9,
      daily_rentals: 95
    },
    {
      station_id: 'STN006',
      station_name: 'Airport Station',
      station_address: 'Mumbai Airport, Terminal 2, Andheri',
      distance: '8.5 km',
      total_capacity: 70,
      available_cycles: 0,
      rented_cycles: 65,
      maintenance_cycles: 5,
      operating_hours: '24/7',
      contact_number: '+91 98765 43215',
      station_type: 'Premium',
      status: 'full',
      occupancy_rate: 0,
      daily_rentals: 124
    }
  ];

  // Station statistics
  const stationStats = {
    total: nearbyStations.length + 1,
    operational: nearbyStations.filter(s => s.status === 'operational').length + 1,
    lowCapacity: nearbyStations.filter(s => s.status === 'low-capacity').length,
    critical: nearbyStations.filter(s => s.status === 'critical').length,
    full: nearbyStations.filter(s => s.status === 'full').length
  };

  // Filter stations
  const filteredStations = nearbyStations.filter(station => {
    const matchesSearch = station.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.station_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.station_address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#10b981';
      case 'low-capacity': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'full': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return <CheckCircle size={16} />;
      case 'low-capacity': return <AlertCircle size={16} />;
      case 'critical': return <AlertCircle size={16} />;
      case 'full': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'operational': return 'Operational';
      case 'low-capacity': return 'Low Capacity';
      case 'critical': return 'Critical';
      case 'full': return 'Full';
      default: return status;
    }
  };

  const handleViewDetails = (station) => {
    setSelectedStation(station);
    setShowStationDetails(true);
  };

  const handleUpdateCapacity = (station) => {
    setSelectedStation(station);
    setShowUpdateCapacity(true);
  };

  return (
    <div className="station-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <MapPin className="title-icon" />
              Station Management
            </h1>
            <p className="page-subtitle">Monitor and manage station operations</p>
          </div>
          <div className="header-actions">
            <button className="nav-btn">
              <Navigation size={20} />
              Directions
            </button>
            <button className="export-btn">
              <Download size={20} />
              Export Data
            </button>
          </div>
        </div>

      </div>
      
        {/* Statistics Cards */}
        <div className="stats-row">
          <div className="stat-item total">
            <div className="stat-icon-wrapper">
              <MapPin size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Stations</span>
              <span className="stat-value">{stationStats.total}</span>
            </div>
          </div>
          <div className="stat-item operational">
            <div className="stat-icon-wrapper">
              <CheckCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Operational</span>
              <span className="stat-value">{stationStats.operational}</span>
            </div>
          </div>
          <div className="stat-item low-capacity">
            <div className="stat-icon-wrapper">
              <AlertCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Low Capacity</span>
              <span className="stat-value">{stationStats.lowCapacity}</span>
            </div>
          </div>
          <div className="stat-item critical">
            <div className="stat-icon-wrapper">
              <AlertCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Critical</span>
              <span className="stat-value">{stationStats.critical}</span>
            </div>
          </div>
          <div className="stat-item full">
            <div className="stat-icon-wrapper">
              <XCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Full</span>
              <span className="stat-value">{stationStats.full}</span>
            </div>
          </div>
        </div>

      {/* My Station Card */}
      <div className="my-station-section">
        <div className="section-title-bar">
          <h2 className="section-title">
            <Zap size={24} />
            My Assigned Station
          </h2>
          <button className="refresh-btn">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="my-station-card">
          <div className="station-header">
            <div className="station-title-group">
              <h3 className="station-name">{currentStation.station_name}</h3>
              <span 
                className="station-status-badge"
                style={{ backgroundColor: getStatusColor(currentStation.status) }}
              >
                {getStatusIcon(currentStation.status)}
                {getStatusText(currentStation.status)}
              </span>
              <span className="station-type-badge">{currentStation.station_type}</span>
            </div>
            <button className="settings-btn" onClick={() => handleViewDetails(currentStation)}>
              <Settings size={20} />
            </button>
          </div>

          <div className="station-info-grid">
            <div className="info-item">
              <MapPin size={18} />
              <div>
                <span className="info-label">Address</span>
                <span className="info-value">{currentStation.station_address}</span>
              </div>
            </div>
            <div className="info-item">
              <Phone size={18} />
              <div>
                <span className="info-label">Contact</span>
                <span className="info-value">{currentStation.contact_number}</span>
              </div>
            </div>
            <div className="info-item">
              <Clock size={18} />
              <div>
                <span className="info-label">Operating Hours</span>
                <span className="info-value">{currentStation.operating_hours}</span>
              </div>
            </div>
            <div className="info-item">
              <Users size={18} />
              <div>
                <span className="info-label">Manager</span>
                <span className="info-value">{currentStation.manager_name}</span>
              </div>
            </div>
          </div>

          {/* Capacity Overview */}
          <div className="capacity-overview">
            <h4 className="capacity-title">Current Capacity</h4>
            <div className="capacity-stats">
              <div className="capacity-item available">
                <Bike size={20} />
                <div>
                  <span className="capacity-number">{currentStation.available_cycles}</span>
                  <span className="capacity-label">Available</span>
                </div>
              </div>
              <div className="capacity-item rented">
                <Activity size={20} />
                <div>
                  <span className="capacity-number">{currentStation.rented_cycles}</span>
                  <span className="capacity-label">Rented</span>
                </div>
              </div>
              <div className="capacity-item maintenance">
                <Settings size={20} />
                <div>
                  <span className="capacity-number">{currentStation.maintenance_cycles}</span>
                  <span className="capacity-label">Maintenance</span>
                </div>
              </div>
              <div className="capacity-item total">
                <BarChart3 size={20} />
                <div>
                  <span className="capacity-number">{currentStation.total_capacity}</span>
                  <span className="capacity-label">Total Capacity</span>
                </div>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="occupancy-section">
              <div className="occupancy-header">
                <span className="occupancy-label">Occupancy Rate</span>
                <span className="occupancy-percentage">{currentStation.occupancy_rate}%</span>
              </div>
              <div className="occupancy-bar">
                <div 
                  className="occupancy-fill"
                  style={{ 
                    width: `${currentStation.occupancy_rate}%`,
                    backgroundColor: currentStation.occupancy_rate > 50 ? '#10b981' : 
                                   currentStation.occupancy_rate > 20 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="performance-metrics">
            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                <TrendingUp size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-value">{currentStation.daily_rentals}</span>
                <span className="metric-label">Today's Rentals</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                <DollarSign size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-value">₹{currentStation.daily_revenue}</span>
                <span className="metric-label">Today's Revenue</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Clock size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-value">Peak Hours</span>
                <span className="metric-label">{currentStation.peak_hours}</span>
              </div>
            </div>
          </div>

          <div className="last-updated">
            <RefreshCw size={14} />
            Last updated: {currentStation.last_updated}
          </div>
        </div>
      </div>

      {/* Nearby Stations */}
      <div className="nearby-stations-section">
        <div className="section-title-bar">
          <h2 className="section-title">
            <MapPin size={24} />
            Nearby Stations
          </h2>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="controls-section">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search stations..."
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

          <div className="filter-controls">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
              <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
            </button>

            {showFilters && (
              <div className="filters-dropdown">
                <div className="filter-group">
                  <label>Status</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="operational">Operational</option>
                    <option value="low-capacity">Low Capacity</option>
                    <option value="critical">Critical</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                <button 
                  className="reset-filters"
                  onClick={() => setFilterStatus('all')}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stations Grid/List */}
        <div className={`stations-${viewMode}`}>
          {filteredStations.map((station, index) => (
            <div 
              key={station.station_id} 
              className="station-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="station-card-header">
                <div className="station-title-group">
                  <h3 className="station-name">{station.station_name}</h3>
                  <span 
                    className="station-status-badge"
                    style={{ backgroundColor: getStatusColor(station.status) }}
                  >
                    {getStatusIcon(station.status)}
                    {getStatusText(station.status)}
                  </span>
                </div>
                <span className="distance-badge">
                  <Navigation size={14} />
                  {station.distance}
                </span>
              </div>

              <div className="station-card-body">
                <div className="station-address">
                  <MapPin size={16} />
                  <span>{station.station_address}</span>
                </div>

                <div className="station-quick-stats">
                  <div className="quick-stat">
                    <Bike size={16} />
                    <span>{station.available_cycles}/{station.total_capacity}</span>
                  </div>
                  <div className="quick-stat">
                    <Activity size={16} />
                    <span>{station.rented_cycles} Rented</span>
                  </div>
                  <div className="quick-stat">
                    <TrendingUp size={16} />
                    <span>{station.daily_rentals} Today</span>
                  </div>
                </div>

                <div className="station-occupancy">
                  <div className="occupancy-bar-small">
                    <div 
                      className="occupancy-fill-small"
                      style={{ 
                        width: `${station.occupancy_rate}%`,
                        backgroundColor: station.occupancy_rate > 50 ? '#10b981' : 
                                       station.occupancy_rate > 20 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="occupancy-text">{station.occupancy_rate}% Available</span>
                </div>

                <div className="station-meta">
                  <span className="meta-item">
                    <Clock size={14} />
                    {station.operating_hours}
                  </span>
                  <span className="meta-item">
                    <Phone size={14} />
                    {station.contact_number}
                  </span>
                </div>
              </div>

              <div className="station-card-actions">
                <button 
                  className="action-btn view"
                  onClick={() => handleViewDetails(station)}
                >
                  <Eye size={16} />
                  Details
                </button>
                <button 
                  className="action-btn update"
                  onClick={() => handleUpdateCapacity(station)}
                >
                  <RefreshCw size={16} />
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStations.length === 0 && (
          <div className="empty-state">
            <MapPin size={64} />
            <h3>No stations found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Station Details Modal */}
      {showStationDetails && selectedStation && (
        <div className="modal-overlay" onClick={() => setShowStationDetails(false)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Station Details</h2>
              <button className="close-modal" onClick={() => setShowStationDetails(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="details-content">
              <div className="detail-row">
                <span className="detail-label">Station ID:</span>
                <span className="detail-value">{selectedStation.station_id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Station Name:</span>
                <span className="detail-value">{selectedStation.station_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{selectedStation.station_address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedStation.station_type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span 
                  className="status-badge-inline"
                  style={{ backgroundColor: getStatusColor(selectedStation.status) }}
                >
                  {getStatusText(selectedStation.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Capacity:</span>
                <span className="detail-value">{selectedStation.total_capacity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Available Cycles:</span>
                <span className="detail-value">{selectedStation.available_cycles}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rented Cycles:</span>
                <span className="detail-value">{selectedStation.rented_cycles}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Operating Hours:</span>
                <span className="detail-value">{selectedStation.operating_hours}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Contact Number:</span>
                <span className="detail-value">{selectedStation.contact_number}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Occupancy Rate:</span>
                <span className="detail-value">{selectedStation.occupancy_rate}%</span>
              </div>
              {selectedStation.distance && (
                <div className="detail-row">
                  <span className="detail-label">Distance:</span>
                  <span className="detail-value">{selectedStation.distance}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowStationDetails(false)}>
                Close
              </button>
              <button className="primary-btn">
                <Navigation size={16} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Capacity Modal */}
      {showUpdateCapacity && selectedStation && (
        <div className="modal-overlay" onClick={() => setShowUpdateCapacity(false)}>
          <div className="modal-content update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Capacity - {selectedStation.station_name}</h2>
              <button className="close-modal" onClick={() => setShowUpdateCapacity(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="update-content">
              <div className="update-section">
                <h3>Available Cycles</h3>
                <div className="counter-group">
                  <button className="counter-btn minus">
                    <Minus size={20} />
                  </button>
                  <span className="counter-value">{selectedStation.available_cycles}</span>
                  <button className="counter-btn plus">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="update-section">
                <h3>Rented Cycles</h3>
                <div className="counter-group">
                  <button className="counter-btn minus">
                    <Minus size={20} />
                  </button>
                  <span className="counter-value">{selectedStation.rented_cycles}</span>
                  <button className="counter-btn plus">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="update-section">
                <h3>Maintenance Cycles</h3>
                <div className="counter-group">
                  <button className="counter-btn minus">
                    <Minus size={20} />
                  </button>
                  <span className="counter-value">{selectedStation.maintenance_cycles}</span>
                  <button className="counter-btn plus">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="total-capacity-display">
                <span>Total Capacity:</span>
                <span className="total-value">{selectedStation.total_capacity}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowUpdateCapacity(false)}>
                Cancel
              </button>
              <button className="primary-btn">
                <CheckCircle size={16} />
                Update Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;