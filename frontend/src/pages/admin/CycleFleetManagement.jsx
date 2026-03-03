import React, { useState } from 'react';
import { 
  Bike, Search, Filter, Plus, Trash2, Edit, Eye, Download,
  Upload, CheckCircle, XCircle, AlertTriangle, Wrench, TrendingUp,
  TrendingDown, BarChart3, Activity, MapPin, Calendar, Clock,
  ChevronDown, X, Check, Settings, RefreshCw, Package, Zap,
  ArrowUpDown, MoreVertical, FileText, PieChart, Award
} from 'lucide-react';
import '../../style/admin/cyclefleetmanagement.css';

const CycleFleetManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCycleDetails, setShowCycleDetails] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Mock cycles data across all stations
  const allCycles = [
    {
      cycle_id: 'CYC001',
      cycle_name: 'Mountain Pro X1',
      cycle_type: 'Mountain Bike',
      cycle_brand: 'Trek',
      cycle_model: 'X-Caliber 8',
      station_name: 'Central Park Station',
      station_id: 'STN001',
      current_status: 'available',
      condition: 'excellent',
      total_rides: 245,
      total_revenue: 36750,
      purchase_date: '2024-01-15',
      last_maintenance: '2026-01-10',
      next_maintenance: '2026-02-10',
      maintenance_cost: 2500,
      average_rating: 4.8,
      battery_level: 95,
      qr_code: 'QR-MP-001'
    },
    {
      cycle_id: 'CYC002',
      cycle_name: 'City Cruiser Alpha',
      cycle_type: 'City Bike',
      cycle_brand: 'Giant',
      cycle_model: 'Escape 3',
      station_name: 'Beach View Station',
      station_id: 'STN002',
      current_status: 'rented',
      condition: 'good',
      total_rides: 189,
      total_revenue: 28350,
      purchase_date: '2024-02-20',
      last_maintenance: '2026-01-12',
      next_maintenance: '2026-02-12',
      maintenance_cost: 1800,
      average_rating: 4.5,
      battery_level: 78,
      qr_code: 'QR-CC-002'
    },
    {
      cycle_id: 'CYC003',
      cycle_name: 'Speed Racer Pro',
      cycle_type: 'Road Bike',
      cycle_brand: 'Specialized',
      cycle_model: 'Allez Elite',
      station_name: 'Mall Road Station',
      station_id: 'STN003',
      current_status: 'maintenance',
      condition: 'fair',
      total_rides: 312,
      total_revenue: 46800,
      purchase_date: '2023-11-10',
      last_maintenance: '2026-01-14',
      next_maintenance: '2026-01-20',
      maintenance_cost: 4200,
      average_rating: 4.3,
      battery_level: 45,
      qr_code: 'QR-SR-003'
    },
    {
      cycle_id: 'CYC004',
      cycle_name: 'Urban Explorer',
      cycle_type: 'Hybrid',
      cycle_brand: 'Cannondale',
      cycle_model: 'Quick 4',
      station_name: 'University Station',
      station_id: 'STN004',
      current_status: 'available',
      condition: 'excellent',
      total_rides: 156,
      total_revenue: 23400,
      purchase_date: '2024-03-05',
      last_maintenance: '2026-01-08',
      next_maintenance: '2026-02-08',
      maintenance_cost: 1500,
      average_rating: 4.9,
      battery_level: 88,
      qr_code: 'QR-UE-004'
    },
    {
      cycle_id: 'CYC005',
      cycle_name: 'Electric Swift E-200',
      cycle_type: 'E-Bike',
      cycle_brand: 'Rad Power',
      cycle_model: 'RadCity 5',
      station_name: 'Tech Park Station',
      station_id: 'STN005',
      current_status: 'available',
      condition: 'good',
      total_rides: 423,
      total_revenue: 84600,
      purchase_date: '2023-08-20',
      last_maintenance: '2026-01-15',
      next_maintenance: '2026-02-15',
      maintenance_cost: 5600,
      average_rating: 4.7,
      battery_level: 92,
      qr_code: 'QR-ES-005'
    },
    {
      cycle_id: 'CYC006',
      cycle_name: 'Kids Wonder Mini',
      cycle_type: 'Kids Bike',
      cycle_brand: 'Schwinn',
      cycle_model: 'Koen 20',
      station_name: 'Central Park Station',
      station_id: 'STN001',
      current_status: 'damaged',
      condition: 'poor',
      total_rides: 78,
      total_revenue: 7800,
      purchase_date: '2024-05-12',
      last_maintenance: '2026-01-11',
      next_maintenance: '2026-01-18',
      maintenance_cost: 3200,
      average_rating: 3.8,
      battery_level: 0,
      qr_code: 'QR-KW-006'
    },
    {
      cycle_id: 'CYC007',
      cycle_name: 'Trail Master X9',
      cycle_type: 'Mountain Bike',
      cycle_brand: 'Scott',
      cycle_model: 'Scale 970',
      station_name: 'Beach View Station',
      station_id: 'STN002',
      current_status: 'rented',
      condition: 'good',
      total_rides: 201,
      total_revenue: 30150,
      purchase_date: '2024-01-28',
      last_maintenance: '2026-01-09',
      next_maintenance: '2026-02-09',
      maintenance_cost: 2200,
      average_rating: 4.6,
      battery_level: 82,
      qr_code: 'QR-TM-007'
    },
    {
      cycle_id: 'CYC008',
      cycle_name: 'Comfort Ride Deluxe',
      cycle_type: 'Comfort Bike',
      cycle_brand: 'Raleigh',
      cycle_model: 'Detour 2',
      station_name: 'Mall Road Station',
      station_id: 'STN003',
      current_status: 'available',
      condition: 'excellent',
      total_rides: 167,
      total_revenue: 25050,
      purchase_date: '2024-04-10',
      last_maintenance: '2026-01-13',
      next_maintenance: '2026-02-13',
      maintenance_cost: 1600,
      average_rating: 4.8,
      battery_level: 100,
      qr_code: 'QR-CR-008'
    },
    {
      cycle_id: 'CYC009',
      cycle_name: 'Sport Glide S5',
      cycle_type: 'Road Bike',
      cycle_brand: 'Trek',
      cycle_model: 'Domane AL 2',
      station_name: 'University Station',
      station_id: 'STN004',
      current_status: 'maintenance',
      condition: 'fair',
      total_rides: 289,
      total_revenue: 43350,
      purchase_date: '2023-12-05',
      last_maintenance: '2026-01-16',
      next_maintenance: '2026-01-25',
      maintenance_cost: 3800,
      average_rating: 4.4,
      battery_level: 0,
      qr_code: 'QR-SG-009'
    },
    {
      cycle_id: 'CYC010',
      cycle_name: 'E-Thunder 3000',
      cycle_type: 'E-Bike',
      cycle_brand: 'Specialized',
      cycle_model: 'Turbo Vado',
      station_name: 'Tech Park Station',
      station_id: 'STN005',
      current_status: 'available',
      condition: 'excellent',
      total_rides: 512,
      total_revenue: 102400,
      purchase_date: '2023-07-15',
      last_maintenance: '2026-01-14',
      next_maintenance: '2026-02-14',
      maintenance_cost: 6200,
      average_rating: 4.9,
      battery_level: 98,
      qr_code: 'QR-ET-010'
    }
  ];

  // Fleet statistics
  const fleetStats = {
    total: allCycles.length,
    available: allCycles.filter(c => c.current_status === 'available').length,
    rented: allCycles.filter(c => c.current_status === 'rented').length,
    maintenance: allCycles.filter(c => c.current_status === 'maintenance').length,
    damaged: allCycles.filter(c => c.current_status === 'damaged').length,
    totalRevenue: allCycles.reduce((sum, c) => sum + c.total_revenue, 0),
    totalRides: allCycles.reduce((sum, c) => sum + c.total_rides, 0),
    averageRating: (allCycles.reduce((sum, c) => sum + c.average_rating, 0) / allCycles.length).toFixed(1),
    maintenanceDue: allCycles.filter(c => {
      const dueDate = new Date(c.next_maintenance);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length
  };

  // Performance categories
  const performanceStats = {
    topPerformers: allCycles.filter(c => c.total_rides > 250).length,
    lowPerformers: allCycles.filter(c => c.total_rides < 100).length,
    excellentCondition: allCycles.filter(c => c.condition === 'excellent').length,
    needsAttention: allCycles.filter(c => c.condition === 'poor' || c.condition === 'fair').length
  };

  // Filter cycles
  const filteredCycles = allCycles.filter(cycle => {
    const matchesSearch = cycle.cycle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.cycle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.qr_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.station_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cycle.current_status === filterStatus;
    const matchesType = filterType === 'all' || cycle.cycle_type === filterType;
    const matchesStation = filterStation === 'all' || cycle.station_id === filterStation;
    const matchesCondition = filterCondition === 'all' || cycle.condition === filterCondition;
    return matchesSearch && matchesStatus && matchesType && matchesStation && matchesCondition;
  });

  // Sort cycles
  const sortedCycles = [...filteredCycles].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.cycle_name.localeCompare(b.cycle_name);
      case 'rides': return b.total_rides - a.total_rides;
      case 'revenue': return b.total_revenue - a.total_revenue;
      case 'rating': return b.average_rating - a.average_rating;
      case 'status': return a.current_status.localeCompare(b.current_status);
      default: return 0;
    }
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

  const handleSelectCycle = (cycleId) => {
    setSelectedCycles(prev => 
      prev.includes(cycleId) 
        ? prev.filter(id => id !== cycleId)
        : [...prev, cycleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCycles.length === sortedCycles.length) {
      setSelectedCycles([]);
    } else {
      setSelectedCycles(sortedCycles.map(c => c.cycle_id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on ${selectedCycles.length} cycles`);
    // Implement bulk action logic
    setSelectedCycles([]);
    setShowBulkActions(false);
  };

  return (
    <div className="cycle-fleet-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">
              <Bike className="title-icon" />
              Cycle Fleet Management
            </h1>
            <p className="page-subtitle">Manage and monitor your entire cycle fleet across all stations</p>
          </div>
          <div className="header-actions">
            <button className="add-cycle-btn" onClick={() => setShowAddCycle(true)}>
              <Plus size={20} />
              Add New Cycle
            </button>
            <button className="import-btn">
              <Upload size={20} />
              Import
            </button>
            <button className="export-btn">
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Main Statistics Grid */}
        
      </div>
      <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon-wrapper">
              <Bike size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Fleet</span>
              <span className="stat-value">{fleetStats.total}</span>
              <span className="stat-trend positive">
                <TrendingUp size={14} />
                +12 this month
              </span>
            </div>
          </div>

          <div className="stat-card available">
            <div className="stat-icon-wrapper">
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Available</span>
              <span className="stat-value">{fleetStats.available}</span>
              <span className="stat-detail">{((fleetStats.available/fleetStats.total)*100).toFixed(0)}% of fleet</span>
            </div>
          </div>

          <div className="stat-card rented">
            <div className="stat-icon-wrapper">
              <Activity size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Currently Rented</span>
              <span className="stat-value">{fleetStats.rented}</span>
              <span className="stat-detail">{((fleetStats.rented/fleetStats.total)*100).toFixed(0)}% utilization</span>
            </div>
          </div>

          <div className="stat-card maintenance">
            <div className="stat-icon-wrapper">
              <Wrench size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">In Maintenance</span>
              <span className="stat-value">{fleetStats.maintenance}</span>
              <span className="stat-detail">{fleetStats.maintenanceDue} due soon</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon-wrapper">
              <TrendingUp size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{(fleetStats.totalRevenue/1000).toFixed(0)}K</span>
              <span className="stat-trend positive">
                <TrendingUp size={14} />
                +18% vs last month
              </span>
            </div>
          </div>

          <div className="stat-card rides">
            <div className="stat-icon-wrapper">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Rides</span>
              <span className="stat-value">{fleetStats.totalRides}</span>
              <span className="stat-detail">Avg: {(fleetStats.totalRides/fleetStats.total).toFixed(0)} per cycle</span>
            </div>
          </div>

          <div className="stat-card rating">
            <div className="stat-icon-wrapper">
              <Award size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Avg Rating</span>
              <span className="stat-value">{fleetStats.averageRating}</span>
              <span className="stat-detail">⭐⭐⭐⭐⭐</span>
            </div>
          </div>

          <div className="stat-card damaged">
            <div className="stat-icon-wrapper">
              <AlertTriangle size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Needs Attention</span>
              <span className="stat-value">{fleetStats.damaged + performanceStats.needsAttention}</span>
              <span className="stat-trend negative">
                <AlertTriangle size={14} />
                Requires action
              </span>
            </div>
          </div>
        </div>

      {/* Performance Overview */}
      <div className="performance-section">
        <h2 className="section-title">
          <PieChart size={24} />
          Performance Overview
        </h2>
        <div className="performance-grid">
          <div className="performance-card top-performers">
            <div className="perf-icon">
              <TrendingUp size={24} />
            </div>
            <div className="perf-info">
              <span className="perf-value">{performanceStats.topPerformers}</span>
              <span className="perf-label">Top Performers</span>
              <span className="perf-desc">250+ rides completed</span>
            </div>
          </div>
          <div className="performance-card low-performers">
            <div className="perf-icon">
              <TrendingDown size={24} />
            </div>
            <div className="perf-info">
              <span className="perf-value">{performanceStats.lowPerformers}</span>
              <span className="perf-label">Low Performers</span>
              <span className="perf-desc">Less than 100 rides</span>
            </div>
          </div>
          <div className="performance-card excellent">
            <div className="perf-icon">
              <Award size={24} />
            </div>
            <div className="perf-info">
              <span className="perf-value">{performanceStats.excellentCondition}</span>
              <span className="perf-label">Excellent Condition</span>
              <span className="perf-desc">Ready for premium service</span>
            </div>
          </div>
          <div className="performance-card attention">
            <div className="perf-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="perf-info">
              <span className="perf-value">{performanceStats.needsAttention}</span>
              <span className="perf-label">Needs Attention</span>
              <span className="perf-desc">Maintenance required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-row">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, QR code, or station..."
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

          <div className="control-buttons">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Advanced Filters
              <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
            </button>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="rides">Sort by Rides</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="rating">Sort by Rating</option>
              <option value="status">Sort by Status</option>
            </select>

            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                Grid
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="filters-panel">
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
                <option value="Comfort Bike">Comfort Bike</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Station</label>
              <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)}>
                <option value="all">All Stations</option>
                <option value="STN001">Central Park Station</option>
                <option value="STN002">Beach View Station</option>
                <option value="STN003">Mall Road Station</option>
                <option value="STN004">University Station</option>
                <option value="STN005">Tech Park Station</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Condition</label>
              <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
                <option value="all">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <button 
              className="reset-filters"
              onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
                setFilterStation('all');
                setFilterCondition('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedCycles.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <input
                type="checkbox"
                checked={selectedCycles.length === sortedCycles.length}
                onChange={handleSelectAll}
                className="bulk-checkbox"
              />
              <span className="bulk-text">{selectedCycles.length} cycle(s) selected</span>
            </div>
            <div className="bulk-buttons">
              <button className="bulk-btn" onClick={() => handleBulkAction('maintenance')}>
                <Wrench size={16} />
                Mark for Maintenance
              </button>
              <button className="bulk-btn" onClick={() => handleBulkAction('relocate')}>
                <MapPin size={16} />
                Relocate
              </button>
              <button className="bulk-btn danger" onClick={() => handleBulkAction('delete')}>
                <Trash2 size={16} />
                Remove
              </button>
              <button className="bulk-btn" onClick={() => handleBulkAction('export')}>
                <Download size={16} />
                Export Selected
              </button>
            </div>
          </div>
        )}

        <div className="results-info">
          Showing {sortedCycles.length} of {allCycles.length} cycles
        </div>
      </div>

      {/* Cycles Display */}
      {viewMode === 'grid' ? (
        <div className="cycles-grid">
          {sortedCycles.map((cycle, index) => (
            <div 
              key={cycle.cycle_id} 
              className={`cycle-card ${selectedCycles.includes(cycle.cycle_id) ? 'selected' : ''}`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="card-header">
                <input
                  type="checkbox"
                  checked={selectedCycles.includes(cycle.cycle_id)}
                  onChange={() => handleSelectCycle(cycle.cycle_id)}
                  className="cycle-checkbox"
                />
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(cycle.current_status) }}
                >
                  {getStatusIcon(cycle.current_status)}
                  {cycle.current_status}
                </span>
              </div>

              <div className="cycle-image-placeholder">
                <Bike size={48} />
              </div>

              <div className="cycle-info">
                <h3 className="cycle-name">{cycle.cycle_name}</h3>
                <p className="cycle-id">ID: {cycle.cycle_id}</p>
                
                <div className="cycle-tags">
                  <span className="tag type">{cycle.cycle_type}</span>
                  <span className="tag brand">{cycle.cycle_brand}</span>
                  <span 
                    className="tag condition"
                    style={{ backgroundColor: getConditionColor(cycle.condition) }}
                  >
                    {cycle.condition}
                  </span>
                </div>

                <div className="cycle-location">
                  <MapPin size={14} />
                  <span>{cycle.station_name}</span>
                </div>

                <div className="cycle-metrics">
                  <div className="metric">
                    <TrendingUp size={16} />
                    <div>
                      <span className="metric-value">{cycle.total_rides}</span>
                      <span className="metric-label">Rides</span>
                    </div>
                  </div>
                  <div className="metric">
                    <BarChart3 size={16} />
                    <div>
                      <span className="metric-value">₹{(cycle.total_revenue/1000).toFixed(1)}K</span>
                      <span className="metric-label">Revenue</span>
                    </div>
                  </div>
                  <div className="metric">
                    <Award size={16} />
                    <div>
                      <span className="metric-value">{cycle.average_rating}</span>
                      <span className="metric-label">Rating</span>
                    </div>
                  </div>
                </div>

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

                <div className="maintenance-info">
                  <Clock size={14} />
                  <span>Next: {cycle.next_maintenance}</span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="action-btn view"
                  onClick={() => {
                    setSelectedCycle(cycle);
                    setShowCycleDetails(true);
                  }}
                >
                  <Eye size={16} />
                </button>
                <button className="action-btn edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={16} />
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
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCycles.length === sortedCycles.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Station</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Rides</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCycles.map((cycle) => (
                <tr key={cycle.cycle_id} className={selectedCycles.includes(cycle.cycle_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCycles.includes(cycle.cycle_id)}
                      onChange={() => handleSelectCycle(cycle.cycle_id)}
                    />
                  </td>
                  <td className="cycle-id-cell">{cycle.cycle_id}</td>
                  <td className="cycle-name-cell">
                    <strong>{cycle.cycle_name}</strong>
                    <span className="brand-text">{cycle.cycle_brand}</span>
                  </td>
                  <td>{cycle.cycle_type}</td>
                  <td className="station-cell">
                    <MapPin size={14} />
                    {cycle.station_name}
                  </td>
                  <td>
                    <span 
                      className="status-badge-table"
                      style={{ backgroundColor: getStatusColor(cycle.current_status) }}
                    >
                      {cycle.current_status}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="condition-badge-table"
                      style={{ backgroundColor: getConditionColor(cycle.condition) }}
                    >
                      {cycle.condition}
                    </span>
                  </td>
                  <td className="rides-cell">{cycle.total_rides}</td>
                  <td className="revenue-cell">₹{(cycle.total_revenue/1000).toFixed(1)}K</td>
                  <td className="rating-cell">
                    <Award size={14} />
                    {cycle.average_rating}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="table-action-btn"
                      onClick={() => {
                        setSelectedCycle(cycle);
                        setShowCycleDetails(true);
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="table-action-btn">
                      <Edit size={16} />
                    </button>
                    <button className="table-action-btn danger">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {sortedCycles.length === 0 && (
        <div className="empty-state">
          <Bike size={64} />
          <h3>No cycles found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Add Cycle Modal */}
      {showAddCycle && (
        <div className="modal-overlay" onClick={() => setShowAddCycle(false)}>
          <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Cycle</h2>
              <button className="close-modal" onClick={() => setShowAddCycle(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Cycle Name</label>
                  <input type="text" placeholder="Enter cycle name" />
                </div>
                <div className="form-group">
                  <label>Cycle ID</label>
                  <input type="text" placeholder="Auto-generated" disabled />
                </div>
                <div className="form-group">
                  <label>Cycle Type</label>
                  <select>
                    <option>Mountain Bike</option>
                    <option>City Bike</option>
                    <option>Road Bike</option>
                    <option>Hybrid</option>
                    <option>E-Bike</option>
                    <option>Kids Bike</option>
                    <option>Comfort Bike</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input type="text" placeholder="Enter brand name" />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input type="text" placeholder="Enter model" />
                </div>
                <div className="form-group">
                  <label>Station</label>
                  <select>
                    <option>Central Park Station</option>
                    <option>Beach View Station</option>
                    <option>Mall Road Station</option>
                    <option>University Station</option>
                    <option>Tech Park Station</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>QR Code</label>
                  <input type="text" placeholder="Enter or generate QR code" />
                </div>
                <div className="form-group">
                  <label>Purchase Date</label>
                  <input type="date" />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowAddCycle(false)}>
                Cancel
              </button>
              <button className="primary-btn">
                <Plus size={16} />
                Add Cycle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Details Modal */}
      {showCycleDetails && selectedCycle && (
        <div className="modal-overlay" onClick={() => setShowCycleDetails(false)}>
          <div className="modal-content details-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCycle.cycle_name}</h2>
              <button className="close-modal" onClick={() => setShowCycleDetails(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="details-grid">
              <div className="details-section">
                <h3>Basic Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Cycle ID:</span>
                  <span className="detail-value">{selectedCycle.cycle_id}</span>
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
              </div>

              <div className="details-section">
                <h3>Status & Condition</h3>
                <div className="detail-row">
                  <span className="detail-label">Current Status:</span>
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
                  <span className="detail-label">Current Station:</span>
                  <span className="detail-value">{selectedCycle.station_name}</span>
                </div>
                {selectedCycle.battery_level > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Battery Level:</span>
                    <span className="detail-value">{selectedCycle.battery_level}%</span>
                  </div>
                )}
              </div>

              <div className="details-section">
                <h3>Performance Metrics</h3>
                <div className="detail-row">
                  <span className="detail-label">Total Rides:</span>
                  <span className="detail-value">{selectedCycle.total_rides}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Revenue:</span>
                  <span className="detail-value">₹{selectedCycle.total_revenue.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Average Rating:</span>
                  <span className="detail-value">⭐ {selectedCycle.average_rating}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Revenue per Ride:</span>
                  <span className="detail-value">₹{(selectedCycle.total_revenue/selectedCycle.total_rides).toFixed(0)}</span>
                </div>
              </div>

              <div className="details-section">
                <h3>Maintenance Information</h3>
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
                <div className="detail-row">
                  <span className="detail-label">Maintenance Cost:</span>
                  <span className="detail-value">₹{selectedCycle.maintenance_cost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowCycleDetails(false)}>
                Close
              </button>
              <button className="primary-btn">
                <Edit size={16} />
                Edit Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleFleetManagement;