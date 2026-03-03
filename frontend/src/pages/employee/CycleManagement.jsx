import React, { useState } from 'react';
import { 
  Bike, Search, Filter, QrCode, Edit, Trash2, Eye,
  CheckCircle, XCircle, AlertTriangle, Wrench, Plus,
  MapPin, Calendar, BarChart3, Download, Upload,
  ChevronDown, X, Check, Clock, TrendingUp, Activity
} from 'lucide-react';
import '../../style/employee/cyclemanagement.css';

const CycleManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCycleDetails, setShowCycleDetails] = useState(false);

  // Mock cycles data
  const cycles = [
    {
      cycle_id: 'CYC001',
      cycle_name: 'Mountain Pro',
      cycle_type: 'Mountain Bike',
      cycle_brand: 'Trek',
      cycle_model: 'X-Caliber 8',
      qr_code: 'QR-MP-001',
      current_status: 'available',
      total_rides: 245,
      purchase_date: '2024-01-15',
      last_maintenance: '2026-01-10',
      next_maintenance: '2026-02-10',
      condition: 'excellent',
      battery_level: 95
    },
    {
      cycle_id: 'CYC002',
      cycle_name: 'City Cruiser',
      cycle_type: 'City Bike',
      cycle_brand: 'Giant',
      cycle_model: 'Escape 3',
      qr_code: 'QR-CC-002',
      current_status: 'rented',
      total_rides: 189,
      purchase_date: '2024-02-20',
      last_maintenance: '2026-01-12',
      next_maintenance: '2026-02-12',
      condition: 'good',
      battery_level: 78,
      rented_to: 'Amit Sharma',
      rental_start: '2026-01-16 10:30 AM'
    },
    {
      cycle_id: 'CYC003',
      cycle_name: 'Speed Racer',
      cycle_type: 'Road Bike',
      cycle_brand: 'Specialized',
      cycle_model: 'Allez Elite',
      qr_code: 'QR-SR-003',
      current_status: 'maintenance',
      total_rides: 312,
      purchase_date: '2023-11-10',
      last_maintenance: '2026-01-14',
      next_maintenance: '2026-01-20',
      condition: 'fair',
      battery_level: 45,
      maintenance_issue: 'Brake adjustment required'
    },
    {
      cycle_id: 'CYC004',
      cycle_name: 'Urban Explorer',
      cycle_type: 'Hybrid',
      cycle_brand: 'Cannondale',
      cycle_model: 'Quick 4',
      qr_code: 'QR-UE-004',
      current_status: 'available',
      total_rides: 156,
      purchase_date: '2024-03-05',
      last_maintenance: '2026-01-08',
      next_maintenance: '2026-02-08',
      condition: 'excellent',
      battery_level: 88
    },
    {
      cycle_id: 'CYC005',
      cycle_name: 'Electric Swift',
      cycle_type: 'E-Bike',
      cycle_brand: 'Rad Power',
      cycle_model: 'RadCity 5',
      qr_code: 'QR-ES-005',
      current_status: 'available',
      total_rides: 423,
      purchase_date: '2023-08-20',
      last_maintenance: '2026-01-15',
      next_maintenance: '2026-02-15',
      condition: 'good',
      battery_level: 92
    },
    {
      cycle_id: 'CYC006',
      cycle_name: 'Kids Wonder',
      cycle_type: 'Kids Bike',
      cycle_brand: 'Schwinn',
      cycle_model: 'Koen 20',
      qr_code: 'QR-KW-006',
      current_status: 'damaged',
      total_rides: 78,
      purchase_date: '2024-05-12',
      last_maintenance: '2026-01-11',
      next_maintenance: '2026-01-18',
      condition: 'poor',
      battery_level: 0,
      damage_report: 'Front wheel damage, chain broken'
    },
    {
      cycle_id: 'CYC007',
      cycle_name: 'Trail Master',
      cycle_type: 'Mountain Bike',
      cycle_brand: 'Scott',
      cycle_model: 'Scale 970',
      qr_code: 'QR-TM-007',
      current_status: 'rented',
      total_rides: 201,
      purchase_date: '2024-01-28',
      last_maintenance: '2026-01-09',
      next_maintenance: '2026-02-09',
      condition: 'good',
      battery_level: 82,
      rented_to: 'Priya Patel',
      rental_start: '2026-01-16 09:15 AM'
    },
    {
      cycle_id: 'CYC008',
      cycle_name: 'Comfort Ride',
      cycle_type: 'Comfort Bike',
      cycle_brand: 'Raleigh',
      cycle_model: 'Detour 2',
      qr_code: 'QR-CR-008',
      current_status: 'available',
      total_rides: 167,
      purchase_date: '2024-04-10',
      last_maintenance: '2026-01-13',
      next_maintenance: '2026-02-13',
      condition: 'excellent',
      battery_level: 100
    }
  ];

  // Summary statistics
  const stats = {
    total: cycles.length,
    available: cycles.filter(c => c.current_status === 'available').length,
    rented: cycles.filter(c => c.current_status === 'rented').length,
    maintenance: cycles.filter(c => c.current_status === 'maintenance').length,
    damaged: cycles.filter(c => c.current_status === 'damaged').length
  };

  // Filter cycles
  const filteredCycles = cycles.filter(cycle => {
    const matchesSearch = cycle.cycle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.cycle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.qr_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cycle.current_status === filterStatus;
    const matchesType = filterType === 'all' || cycle.cycle_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#10b981';
      case 'rented': return '#3b82f6';
      case 'maintenance': return '#f59e0b';
      case 'damaged': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return <CheckCircle size={16} />;
      case 'rented': return <Activity size={16} />;
      case 'maintenance': return <Wrench size={16} />;
      case 'damaged': return <AlertTriangle size={16} />;
      default: return null;
    }
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleViewDetails = (cycle) => {
    setSelectedCycle(cycle);
    setShowCycleDetails(true);
  };

  const handleUpdateStatus = (cycleId, newStatus) => {
    console.log(`Updating cycle ${cycleId} to status: ${newStatus}`);
    // Implement status update logic
  };

  const handleReportIssue = (cycleId) => {
    console.log(`Reporting issue for cycle ${cycleId}`);
    // Implement issue reporting logic
  };

  return (
    <div className="cycle-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Bike className="title-icon" />
              Cycle Management
            </h1>
            <p className="page-subtitle">Monitor and manage all cycles at your station</p>
          </div>
          <div className="header-actions">
            <button className="scan-qr-btn" onClick={() => setShowQRScanner(true)}>
              <QrCode size={20} />
              Scan QR Code
            </button>
            <button className="export-btn">
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-row">
          <div className="stat-item total">
            <div className="stat-icon-wrapper">
              <Bike size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Cycles</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          <div className="stat-item available">
            <div className="stat-icon-wrapper">
              <CheckCircle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Available</span>
              <span className="stat-value">{stats.available}</span>
            </div>
          </div>
          <div className="stat-item rented">
            <div className="stat-icon-wrapper">
              <Activity size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Rented</span>
              <span className="stat-value">{stats.rented}</span>
            </div>
          </div>
          <div className="stat-item maintenance">
            <div className="stat-icon-wrapper">
              <Wrench size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Maintenance</span>
              <span className="stat-value">{stats.maintenance}</span>
            </div>
          </div>
          <div className="stat-item damaged">
            <div className="stat-icon-wrapper">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Damaged</span>
              <span className="stat-value">{stats.damaged}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by name, ID, or QR code..."
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
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="Mountain Bike">Mountain Bike</option>
                  <option value="City Bike">City Bike</option>
                  <option value="Road Bike">Road Bike</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="E-Bike">E-Bike</option>
                  <option value="Kids Bike">Kids Bike</option>
                </select>
              </div>

              <button 
                className="reset-filters"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        <div className="results-info">
          Showing {filteredCycles.length} of {cycles.length} cycles
        </div>
      </div>

      {/* Cycles Grid */}
      <div className="cycles-grid">
        {filteredCycles.map((cycle, index) => (
          <div 
            key={cycle.cycle_id} 
            className="cycle-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Status Badge */}
            <div 
              className="cycle-status-badge"
              style={{ backgroundColor: getStatusColor(cycle.current_status) }}
            >
              {getStatusIcon(cycle.current_status)}
              <span>{cycle.current_status}</span>
            </div>

            {/* Cycle Image Placeholder */}
            <div className="cycle-image-placeholder">
              <Bike size={48} />
            </div>

            {/* Cycle Info */}
            <div className="cycle-info">
              <h3 className="cycle-name">{cycle.cycle_name}</h3>
              <p className="cycle-id">ID: {cycle.cycle_id}</p>
              <div className="cycle-meta">
                <span className="cycle-type">{cycle.cycle_type}</span>
                <span className="cycle-brand">{cycle.cycle_brand}</span>
              </div>

              {/* QR Code */}
              <div className="qr-code-section">
                <QrCode size={16} />
                <span>{cycle.qr_code}</span>
              </div>

              {/* Stats */}
              <div className="cycle-stats">
                <div className="stat">
                  <TrendingUp size={16} />
                  <span>{cycle.total_rides} rides</span>
                </div>
                <div className="stat">
                  <span 
                    className="condition-badge"
                    style={{ backgroundColor: getConditionColor(cycle.condition) }}
                  >
                    {cycle.condition}
                  </span>
                </div>
              </div>

              {/* Battery Level (for E-Bikes) */}
              {cycle.cycle_type === 'E-Bike' && (
                <div className="battery-indicator">
                  <div className="battery-bar">
                    <div 
                      className="battery-fill"
                      style={{ 
                        width: `${cycle.battery_level}%`,
                        backgroundColor: cycle.battery_level > 50 ? '#10b981' : 
                                       cycle.battery_level > 20 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="battery-text">{cycle.battery_level}%</span>
                </div>
              )}

              {/* Additional Info for Rented/Damaged */}
              {cycle.current_status === 'rented' && (
                <div className="rental-info">
                  <p className="rented-to">Rented to: {cycle.rented_to}</p>
                  <p className="rental-time">Since: {cycle.rental_start}</p>
                </div>
              )}

              {cycle.current_status === 'maintenance' && (
                <div className="maintenance-info">
                  <AlertTriangle size={16} />
                  <p>{cycle.maintenance_issue}</p>
                </div>
              )}

              {cycle.current_status === 'damaged' && (
                <div className="damage-info">
                  <XCircle size={16} />
                  <p>{cycle.damage_report}</p>
                </div>
              )}

              {/* Maintenance Due */}
              <div className="maintenance-due">
                <Clock size={14} />
                <span>Next maintenance: {cycle.next_maintenance}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="cycle-actions">
              <button 
                className="action-btn view"
                onClick={() => handleViewDetails(cycle)}
              >
                <Eye size={16} />
                Details
              </button>
              
              {cycle.current_status === 'available' && (
                <button 
                  className="action-btn maintenance"
                  onClick={() => handleUpdateStatus(cycle.cycle_id, 'maintenance')}
                >
                  <Wrench size={16} />
                  Maintenance
                </button>
              )}

              {cycle.current_status === 'damaged' && (
                <button 
                  className="action-btn report"
                  onClick={() => handleReportIssue(cycle.cycle_id)}
                >
                  <AlertTriangle size={16} />
                  Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCycles.length === 0 && (
        <div className="empty-state">
          <Bike size={64} />
          <h3>No cycles found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="modal-overlay" onClick={() => setShowQRScanner(false)}>
          <div className="modal-content qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Scan Cycle QR Code</h2>
              <button className="close-modal" onClick={() => setShowQRScanner(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="qr-scanner-area">
              <div className="scanner-frame">
                <QrCode size={80} />
                <p>Position QR code within the frame</p>
              </div>
              <div className="scanner-instructions">
                <p>• Ensure good lighting</p>
                <p>• Hold camera steady</p>
                <p>• Align QR code within frame</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowQRScanner(false)}>
                Cancel
              </button>
              <button className="confirm-btn">
                Manual Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Details Modal */}
      {showCycleDetails && selectedCycle && (
        <div className="modal-overlay" onClick={() => setShowCycleDetails(false)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cycle Details</h2>
              <button className="close-modal" onClick={() => setShowCycleDetails(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="details-content">
              <div className="detail-row">
                <span className="detail-label">Cycle ID:</span>
                <span className="detail-value">{selectedCycle.cycle_id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedCycle.cycle_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedCycle.cycle_type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Brand:</span>
                <span className="detail-value">{selectedCycle.cycle_brand}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Model:</span>
                <span className="detail-value">{selectedCycle.cycle_model}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">QR Code:</span>
                <span className="detail-value">{selectedCycle.qr_code}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span 
                  className="status-badge-inline"
                  style={{ backgroundColor: getStatusColor(selectedCycle.current_status) }}
                >
                  {selectedCycle.current_status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Condition:</span>
                <span 
                  className="condition-badge-inline"
                  style={{ backgroundColor: getConditionColor(selectedCycle.condition) }}
                >
                  {selectedCycle.condition}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Rides:</span>
                <span className="detail-value">{selectedCycle.total_rides}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purchase Date:</span>
                <span className="detail-value">{selectedCycle.purchase_date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Maintenance:</span>
                <span className="detail-value">{selectedCycle.last_maintenance}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Next Maintenance:</span>
                <span className="detail-value">{selectedCycle.next_maintenance}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowCycleDetails(false)}>
                Close
              </button>
              <button className="primary-btn">
                <Edit size={16} />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleManagement;