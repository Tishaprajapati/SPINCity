import React, { useState } from 'react';
import '../../style/admin/StationManagement.css';

const AdminStationManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationDetails, setShowStationDetails] = useState(false);
  const [showAddStation, setShowAddStation] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Mock stations data
  const allStations = [
    {
      station_id: 'STN001',
      station_name: 'Central Park Station',
      station_address: '123 MG Road, Ahmedabad, Gujarat 380001',
      latitude: 23.0225,
      longitude: 72.5714,
      total_capacity: 50,
      available_cycles: 32,
      rented_cycles: 15,
      maintenance_cycles: 3,
      operating_hours: '24/7',
      contact_number: '+91 79 1234 5678',
      station_type: 'Premium',
      status: 'operational',
      manager_name: 'Rajesh Kumar',
      manager_contact: '+91 98765 43210',
      total_rentals: 1245,
      total_revenue: 187500,
      average_rating: 4.8,
      last_maintenance: '2026-01-15',
      facilities: ['Parking', 'Waiting Area', 'Water', 'Restroom']
    },
    {
      station_id: 'STN002',
      station_name: 'Beach View Station',
      station_address: '456 Sabarmati Riverfront, Ahmedabad 380005',
      latitude: 23.0358,
      longitude: 72.5661,
      total_capacity: 40,
      available_cycles: 25,
      rented_cycles: 12,
      maintenance_cycles: 3,
      operating_hours: '6:00 AM - 10:00 PM',
      contact_number: '+91 79 2345 6789',
      station_type: 'Standard',
      status: 'operational',
      manager_name: 'Priya Patel',
      manager_contact: '+91 98765 43211',
      total_rentals: 1089,
      total_revenue: 163350,
      average_rating: 4.6,
      last_maintenance: '2026-01-12',
      facilities: ['Parking', 'Waiting Area', 'Water']
    },
    {
      station_id: 'STN003',
      station_name: 'Mall Road Station',
      station_address: '789 CG Road, Ahmedabad 380009',
      latitude: 23.0359,
      longitude: 72.5575,
      total_capacity: 60,
      available_cycles: 38,
      rented_cycles: 18,
      maintenance_cycles: 4,
      operating_hours: '24/7',
      contact_number: '+91 79 3456 7890',
      station_type: 'Premium',
      status: 'operational',
      manager_name: 'Amit Sharma',
      manager_contact: '+91 98765 43212',
      total_rentals: 1567,
      total_revenue: 235050,
      average_rating: 4.7,
      last_maintenance: '2026-01-14',
      facilities: ['Parking', 'Waiting Area', 'Water', 'Restroom', 'Cafe']
    },
    {
      station_id: 'STN004',
      station_name: 'University Station',
      station_address: '321 Navrangpura, Ahmedabad 380009',
      latitude: 23.0404,
      longitude: 72.5595,
      total_capacity: 35,
      available_cycles: 20,
      rented_cycles: 10,
      maintenance_cycles: 5,
      operating_hours: '6:00 AM - 11:00 PM',
      contact_number: '+91 79 4567 8901',
      station_type: 'Standard',
      status: 'maintenance',
      manager_name: 'Sneha Mehta',
      manager_contact: '+91 98765 43213',
      total_rentals: 892,
      total_revenue: 133800,
      average_rating: 4.5,
      last_maintenance: '2026-01-18',
      facilities: ['Parking', 'Waiting Area']
    },
    {
      station_id: 'STN005',
      station_name: 'Tech Park Station',
      station_address: '567 SG Highway, Ahmedabad 380015',
      latitude: 23.0765,
      longitude: 72.5143,
      total_capacity: 45,
      available_cycles: 28,
      rented_cycles: 14,
      maintenance_cycles: 3,
      operating_hours: '24/7',
      contact_number: '+91 79 5678 9012',
      station_type: 'Premium',
      status: 'operational',
      manager_name: 'Rahul Singh',
      manager_contact: '+91 98765 43214',
      total_rentals: 1423,
      total_revenue: 213450,
      average_rating: 4.9,
      last_maintenance: '2026-01-10',
      facilities: ['Parking', 'Waiting Area', 'Water', 'Restroom', 'Cafe', 'Charging']
    },
    {
      station_id: 'STN006',
      station_name: 'Airport Station',
      station_address: '890 Airport Road, Ahmedabad 382475',
      latitude: 23.0726,
      longitude: 72.6347,
      total_capacity: 55,
      available_cycles: 12,
      rented_cycles: 35,
      maintenance_cycles: 8,
      operating_hours: '24/7',
      contact_number: '+91 79 6789 0123',
      station_type: 'Premium',
      status: 'low-capacity',
      manager_name: 'Kavita Desai',
      manager_contact: '+91 98765 43215',
      total_rentals: 2134,
      total_revenue: 320100,
      average_rating: 4.8,
      last_maintenance: '2026-01-16',
      facilities: ['Parking', 'Waiting Area', 'Water', 'Restroom', 'Charging']
    }
  ];

  // Calculate fleet statistics
  const fleetStats = {
    totalStations: allStations.length,
    operational: allStations.filter(s => s.status === 'operational').length,
    maintenance: allStations.filter(s => s.status === 'maintenance').length,
    lowCapacity: allStations.filter(s => s.status === 'low-capacity').length,
    totalCapacity: allStations.reduce((sum, s) => sum + s.total_capacity, 0),
    totalAvailable: allStations.reduce((sum, s) => sum + s.available_cycles, 0),
    totalRented: allStations.reduce((sum, s) => sum + s.rented_cycles, 0),
    totalRevenue: allStations.reduce((sum, s) => sum + s.total_revenue, 0),
    averageRating: (allStations.reduce((sum, s) => sum + s.average_rating, 0) / allStations.length).toFixed(1)
  };

  // Filter stations
  const filteredStations = allStations.filter(station => {
    const matchesSearch = station.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.station_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.station_address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
    const matchesType = filterType === 'all' || station.station_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort stations
  const sortedStations = [...filteredStations].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.station_name.localeCompare(b.station_name);
      case 'capacity': return b.total_capacity - a.total_capacity;
      case 'rentals': return b.total_rentals - a.total_rentals;
      case 'revenue': return b.total_revenue - a.total_revenue;
      case 'rating': return b.average_rating - a.average_rating;
      default: return 0;
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'low-capacity': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getUtilizationPercentage = (station) => {
    return Math.round((station.rented_cycles / station.total_capacity) * 100);
  };

  return (
    <div className="station-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <span className="title-icon">📍</span>
              Station Management
            </h1>
            <p className="page-subtitle">Monitor and manage all cycle rental stations</p>
          </div>
          <div className="header-actions">
            <button className="add-station-btn" onClick={() => setShowAddStation(true)}>
              <span>➕</span>
              Add New Station
            </button>
            <button className="map-view-btn">
              <span>🗺️</span>
              Map View
            </button>
          </div>
        </div>
      </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <span className="stat-label">Total Stations</span>
              <span className="stat-value">{fleetStats.totalStations}</span>
              <span className="stat-detail">Across city</span>
            </div>
          </div>

          <div className="stat-card operational">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Operational</span>
              <span className="stat-value">{fleetStats.operational}</span>
              <span className="stat-detail">{Math.round((fleetStats.operational/fleetStats.totalStations)*100)}% active</span>
            </div>
          </div>

          <div className="stat-card capacity">
            <div className="stat-icon">🚴</div>
            <div className="stat-content">
              <span className="stat-label">Total Capacity</span>
              <span className="stat-value">{fleetStats.totalCapacity}</span>
              <span className="stat-detail">{fleetStats.totalAvailable} available</span>
            </div>
          </div>

          <div className="stat-card utilization">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-label">Utilization</span>
              <span className="stat-value">{Math.round((fleetStats.totalRented/fleetStats.totalCapacity)*100)}%</span>
              <span className="stat-detail">{fleetStats.totalRented} rented</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{(fleetStats.totalRevenue/100000).toFixed(1)}L</span>
              <span className="stat-trend positive">📈 +18% vs last month</span>
            </div>
          </div>

          <div className="stat-card rating">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-label">Avg Rating</span>
              <span className="stat-value">{fleetStats.averageRating}</span>
              <span className="stat-detail">Customer satisfaction</span>
            </div>
          </div>
        </div>
      

      
      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-filter-row">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, ID, or address..."
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
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="low-capacity">Low Capacity</option>
            </select>

            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="rentals">Sort by Rentals</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="results-info">
          Showing {sortedStations.length} of {allStations.length} stations
        </div>
      </div>

      {/* Stations Display */}
      {viewMode === 'grid' ? (
        <div className="stations-grid">
          {sortedStations.map((station, index) => (
            <div 
              key={station.station_id} 
              className="station-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-header">
                <span className="station-id">{station.station_id}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(station.status) }}
                >
                  {station.status}
                </span>
              </div>

              <div className="station-image">
                <span className="map-icon">🗺️</span>
              </div>

              <div className="station-info">
                <h3 className="station-name">{station.station_name}</h3>
                <p className="station-address">📍 {station.station_address}</p>
                
                <div className="station-type-tag">
                  <span className={`type-badge ${station.station_type.toLowerCase()}`}>
                    {station.station_type}
                  </span>
                </div>

                <div className="capacity-info">
                  <div className="capacity-bar">
                    <div className="capacity-segment available" style={{ width: `${(station.available_cycles/station.total_capacity)*100}%` }}></div>
                    <div className="capacity-segment rented" style={{ width: `${(station.rented_cycles/station.total_capacity)*100}%` }}></div>
                    <div className="capacity-segment maintenance" style={{ width: `${(station.maintenance_cycles/station.total_capacity)*100}%` }}></div>
                  </div>
                  <div className="capacity-legend">
                    <span className="legend-item">
                      <span className="legend-dot available"></span>
                      {station.available_cycles} Available
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot rented"></span>
                      {station.rented_cycles} Rented
                    </span>
                  </div>
                </div>

                <div className="station-metrics">
                  <div className="metric">
                    <span className="metric-icon">🏆</span>
                    <div>
                      <span className="metric-value">{station.total_rentals}</span>
                      <span className="metric-label">Rentals</span>
                    </div>
                  </div>
                  <div className="metric">
                    <span className="metric-icon">💵</span>
                    <div>
                      <span className="metric-value">₹{(station.total_revenue/1000).toFixed(0)}K</span>
                      <span className="metric-label">Revenue</span>
                    </div>
                  </div>
                  <div className="metric">
                    <span className="metric-icon">⭐</span>
                    <div>
                      <span className="metric-value">{station.average_rating}</span>
                      <span className="metric-label">Rating</span>
                    </div>
                  </div>
                </div>

                <div className="station-footer">
                  <div className="manager-info">
                    <span className="manager-icon">👤</span>
                    <span className="manager-name">{station.manager_name}</span>
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => {
                      setSelectedStation(station);
                      setShowStationDetails(true);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stations-table-card">
          <table className="stations-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Type</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Available</th>
                <th>Utilization</th>
                <th>Rentals</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStations.map((station) => (
                <tr key={station.station_id}>
                  <td>
                    <div className="table-station-info">
                      <strong>{station.station_name}</strong>
                      <span className="table-station-id">{station.station_id}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`table-type-badge ${station.station_type.toLowerCase()}`}>
                      {station.station_type}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="table-status-badge"
                      style={{ backgroundColor: getStatusColor(station.status) }}
                    >
                      {station.status}
                    </span>
                  </td>
                  <td className="capacity-cell">{station.total_capacity}</td>
                  <td className="available-cell">{station.available_cycles}</td>
                  <td>
                    <div className="utilization-cell">
                      <div className="utilization-bar-mini">
                        <div 
                          className="utilization-fill"
                          style={{ 
                            width: `${getUtilizationPercentage(station)}%`,
                            backgroundColor: getUtilizationPercentage(station) > 80 ? '#10b981' : 
                                           getUtilizationPercentage(station) > 50 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{getUtilizationPercentage(station)}%</span>
                    </div>
                  </td>
                  <td className="rentals-cell">{station.total_rentals}</td>
                  <td className="revenue-cell">₹{(station.total_revenue/1000).toFixed(0)}K</td>
                  <td className="rating-cell">⭐ {station.average_rating}</td>
                  <td>
                    <button 
                      className="table-view-btn"
                      onClick={() => {
                        setSelectedStation(station);
                        setShowStationDetails(true);
                      }}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Station Details Modal */}
      {showStationDetails && selectedStation && (
        <div className="modal-overlay" onClick={() => setShowStationDetails(false)}>
          <div className="modal-content station-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStationDetails(false)}>✕</button>
            
            <div className="modal-header-station">
              <div className="modal-station-title">
                <h2>{selectedStation.station_name}</h2>
                <span className="modal-station-id">{selectedStation.station_id}</span>
              </div>
              <span 
                className="modal-status-badge"
                style={{ backgroundColor: getStatusColor(selectedStation.status) }}
              >
                {selectedStation.status}
              </span>
            </div>

            <div className="modal-body-station">
              <div className="details-section">
                <h3>📍 Location Details</h3>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedStation.station_address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Coordinates:</span>
                  <span className="detail-value">{selectedStation.latitude}, {selectedStation.longitude}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Operating Hours:</span>
                  <span className="detail-value">{selectedStation.operating_hours}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{selectedStation.contact_number}</span>
                </div>
              </div>

              <div className="details-section">
                <h3>🚴 Capacity & Fleet</h3>
                <div className="detail-row">
                  <span className="detail-label">Total Capacity:</span>
                  <span className="detail-value">{selectedStation.total_capacity} cycles</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Available:</span>
                  <span className="detail-value available-text">{selectedStation.available_cycles} cycles</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Currently Rented:</span>
                  <span className="detail-value rented-text">{selectedStation.rented_cycles} cycles</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">In Maintenance:</span>
                  <span className="detail-value maintenance-text">{selectedStation.maintenance_cycles} cycles</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Utilization Rate:</span>
                  <span className="detail-value">{getUtilizationPercentage(selectedStation)}%</span>
                </div>
              </div>

              <div className="details-section">
                <h3>📊 Performance Metrics</h3>
                <div className="detail-row">
                  <span className="detail-label">Total Rentals:</span>
                  <span className="detail-value">{selectedStation.total_rentals}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Revenue:</span>
                  <span className="detail-value revenue-text">₹{selectedStation.total_revenue.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Average Rating:</span>
                  <span className="detail-value">⭐ {selectedStation.average_rating}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Station Type:</span>
                  <span className={`detail-value type-badge-inline ${selectedStation.station_type.toLowerCase()}`}>
                    {selectedStation.station_type}
                  </span>
                </div>
              </div>

              <div className="details-section">
                <h3>👤 Management</h3>
                <div className="detail-row">
                  <span className="detail-label">Station Manager:</span>
                  <span className="detail-value">{selectedStation.manager_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Manager Contact:</span>
                  <span className="detail-value">{selectedStation.manager_contact}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Maintenance:</span>
                  <span className="detail-value">{selectedStation.last_maintenance}</span>
                </div>
              </div>

              <div className="details-section full-width">
                <h3>🏢 Facilities</h3>
                <div className="facilities-grid">
                  {selectedStation.facilities.map((facility, index) => (
                    <div key={index} className="facility-tag">
                      ✓ {facility}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer-station">
              <button className="footer-btn secondary" onClick={() => setShowStationDetails(false)}>
                Close
              </button>
              <button className="footer-btn primary">
                ✏️ Edit Station
              </button>
              <button className="footer-btn action">
                🔧 Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Station Modal */}
      {showAddStation && (
        <div className="modal-overlay" onClick={() => setShowAddStation(false)}>
          <div className="modal-content add-station-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddStation(false)}>✕</button>
            
            <div className="modal-header-simple">
              <h2>Add New Station</h2>
            </div>

            <div className="modal-body-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Station Name</label>
                  <input type="text" placeholder="Enter station name" />
                </div>
                <div className="form-group">
                  <label>Station ID</label>
                  <input type="text" placeholder="Auto-generated" disabled />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input type="text" placeholder="Enter complete address" />
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="text" placeholder="e.g., 23.0225" />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="text" placeholder="e.g., 72.5714" />
                </div>
                <div className="form-group">
                  <label>Total Capacity</label>
                  <input type="number" placeholder="Number of cycles" />
                </div>
                <div className="form-group">
                  <label>Station Type</label>
                  <select>
                    <option>Premium</option>
                    <option>Standard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Operating Hours</label>
                  <input type="text" placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM" />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label>Manager Name</label>
                  <input type="text" placeholder="Enter manager name" />
                </div>
                <div className="form-group">
                  <label>Manager Contact</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </div>

            <div className="modal-footer-simple">
              <button className="footer-btn secondary" onClick={() => setShowAddStation(false)}>
                Cancel
              </button>
              <button className="footer-btn primary">
                ➕ Add Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStationManagement;