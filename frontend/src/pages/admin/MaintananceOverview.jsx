import React, { useState, useEffect } from 'react';
import { Wrench, Package, Calendar, DollarSign, TrendingUp, Eye, Plus, Edit, AlertTriangle, CheckCircle, Clock, Bike, Search, Filter, Download } from 'lucide-react';
import '../../style/admin/maintananceoverview.css';

const MaintenanceOverview = () => {
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('maintenance');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalMaintenance: 0,
    pendingMaintenance: 0,
    completedToday: 0,
    totalCost: 0,
    lowStockItems: 0,
    totalInventoryValue: 0
  });

  useEffect(() => {
    // Maintenance Logs Data
    const mockMaintenance = [
      {
        maintenance_id: 'MNT0001',
        cycle_id: 'CYC123',
        maintenance_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        maintenance_type: 'Routine Check',
        description: 'Regular maintenance check - brake adjustment, tire pressure check, chain lubrication',
        cost: 250,
        performed_by_emp_id: 'EMP001',
        employee_name: 'Rajesh Kumar',
        next_maintenance_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        parts_replaced: 'Brake Pads, Chain Oil',
        status: 'Completed'
      },
      {
        maintenance_id: 'MNT0002',
        cycle_id: 'CYC087',
        maintenance_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        maintenance_type: 'Repair',
        description: 'Flat tire replacement and gear adjustment',
        cost: 450,
        performed_by_emp_id: 'EMP002',
        employee_name: 'Amit Patel',
        next_maintenance_due: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        parts_replaced: 'Inner Tube, Tire',
        status: 'Completed'
      },
      {
        maintenance_id: 'MNT0003',
        cycle_id: 'CYC234',
        maintenance_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        maintenance_type: 'Scheduled Service',
        description: 'Complete bike service including brake system overhaul',
        cost: 0,
        performed_by_emp_id: 'EMP003',
        employee_name: 'Priya Sharma',
        next_maintenance_due: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        parts_replaced: 'Pending',
        status: 'Scheduled'
      },
      {
        maintenance_id: 'MNT0004',
        cycle_id: 'CYC456',
        maintenance_date: new Date().toISOString(),
        maintenance_type: 'Emergency Repair',
        description: 'Handle bar replacement due to accident damage',
        cost: 0,
        performed_by_emp_id: 'EMP001',
        employee_name: 'Rajesh Kumar',
        next_maintenance_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        parts_replaced: 'In Progress',
        status: 'In Progress'
      },
      {
        maintenance_id: 'MNT0005',
        cycle_id: 'CYC789',
        maintenance_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        maintenance_type: 'Battery Replacement',
        description: 'E-bike battery replacement and electrical system check',
        cost: 2500,
        performed_by_emp_id: 'EMP004',
        employee_name: 'Sneha Reddy',
        next_maintenance_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        parts_replaced: 'Lithium Battery Pack',
        status: 'Completed'
      }
    ];

    // Inventory Data
    const mockInventory = [
      {
        inventory_id: 'INV0001',
        station_id: 'STN05',
        station_name: 'MG Road Station',
        item_name: 'Brake Pads',
        item_type: 'Spare Parts',
        quantity: 45,
        reorder_level: 20,
        last_restocked_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        supplier_name: 'BikeZone Suppliers',
        unit_price: 150,
        status: 'In Stock'
      },
      {
        inventory_id: 'INV0002',
        station_id: 'STN05',
        station_name: 'MG Road Station',
        item_name: 'Inner Tubes',
        item_type: 'Spare Parts',
        quantity: 12,
        reorder_level: 15,
        last_restocked_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        supplier_name: 'BikeZone Suppliers',
        unit_price: 80,
        status: 'Low Stock'
      },
      {
        inventory_id: 'INV0003',
        station_id: 'STN12',
        station_name: 'Tech Park Station',
        item_name: 'Chain Lubricant',
        item_type: 'Consumables',
        quantity: 28,
        reorder_level: 10,
        last_restocked_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        supplier_name: 'Cycle Care Ltd',
        unit_price: 120,
        status: 'In Stock'
      },
      {
        inventory_id: 'INV0004',
        station_id: 'STN03',
        station_name: 'Railway Station',
        item_name: 'Lithium Battery Pack',
        item_type: 'Spare Parts',
        quantity: 8,
        reorder_level: 5,
        last_restocked_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        supplier_name: 'PowerTech Industries',
        unit_price: 2500,
        status: 'In Stock'
      },
      {
        inventory_id: 'INV0005',
        station_id: 'STN08',
        station_name: 'City Mall Station',
        item_name: 'Bike Seats',
        item_type: 'Spare Parts',
        quantity: 3,
        reorder_level: 8,
        last_restocked_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        supplier_name: 'Comfort Cycles',
        unit_price: 350,
        status: 'Low Stock'
      }
    ];

    setMaintenanceLogs(mockMaintenance);
    setInventory(mockInventory);

    // Calculate stats
    const pendingMaintenance = mockMaintenance.filter(m => m.status === 'Scheduled' || m.status === 'In Progress').length;
    const completedToday = mockMaintenance.filter(m => {
      const logDate = new Date(m.maintenance_date);
      const today = new Date();
      return m.status === 'Completed' && 
             logDate.getDate() === today.getDate() &&
             logDate.getMonth() === today.getMonth() &&
             logDate.getFullYear() === today.getFullYear();
    }).length;
    const totalCost = mockMaintenance.filter(m => m.status === 'Completed').reduce((acc, m) => acc + m.cost, 0);
    const lowStockItems = mockInventory.filter(i => i.status === 'Low Stock').length;
    const totalInventoryValue = mockInventory.reduce((acc, i) => acc + (i.quantity * i.unit_price), 0);

    setStats({
      totalMaintenance: mockMaintenance.length,
      pendingMaintenance,
      completedToday,
      totalCost,
      lowStockItems,
      totalInventoryValue
    });
  }, []);

  const filteredMaintenance = maintenanceLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.maintenance_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.cycle_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || log.maintenance_type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.station_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">
            <Wrench className="title-icon" size={40} />
            Maintenance & Inventory Management
          </h1>
          <p className="subtitle">Track maintenance activities and manage inventory stocks</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Maintenance</p>
                <p className="stat-value">{stats.totalMaintenance}</p>
              </div>
              <Wrench className="stat-icon stat-icon-primary" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Pending Tasks</p>
                <p className="stat-value stat-value-warning">{stats.pendingMaintenance}</p>
              </div>
              <Clock className="stat-icon stat-icon-warning" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Completed Today</p>
                <p className="stat-value stat-value-success">{stats.completedToday}</p>
              </div>
              <CheckCircle className="stat-icon stat-icon-success" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Cost (Month)</p>
                <p className="stat-value stat-value-primary">₹{stats.totalCost}</p>
              </div>
              <DollarSign className="stat-icon stat-icon-primary" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Low Stock Items</p>
                <p className="stat-value stat-value-danger">{stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="stat-icon stat-icon-danger" size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Inventory Value</p>
                <p className="stat-value stat-value-success">₹{stats.totalInventoryValue}</p>
              </div>
              <Package className="stat-icon stat-icon-success" size={32} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'maintenance' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <Wrench size={20} />
            Maintenance Logs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} />
            Inventory Management
          </button>
        </div>

        {/* Filters and Search */}
        <div className="filter-section">
          <div className="filter-controls">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'maintenance' ? "Search maintenance logs..." : "Search inventory items..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {activeTab === 'maintenance' && (
              <button onClick={() => setShowFilters(!showFilters)} className="filter-btn">
                <Filter size={18} />
                Filters
              </button>
            )}

            <button className="add-btn">
              <Plus size={18} />
              {activeTab === 'maintenance' ? 'New Maintenance' : 'Add Item'}
            </button>
          </div>

          {showFilters && activeTab === 'maintenance' && (
            <div className="filter-dropdown">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                <option value="all">All Types</option>
                <option value="Routine Check">Routine Check</option>
                <option value="Repair">Repair</option>
                <option value="Scheduled Service">Scheduled Service</option>
                <option value="Emergency Repair">Emergency Repair</option>
                <option value="Battery Replacement">Battery Replacement</option>
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          )}
        </div>

        {/* Maintenance Table */}
        {activeTab === 'maintenance' && (
          <div className="table-container">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Maintenance ID</th>
                    <th>Cycle ID</th>
                    <th>Type</th>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Next Due</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaintenance.map((log) => (
                    <tr key={log.maintenance_id} className="table-row">
                      <td><span className="record-id">{log.maintenance_id}</span></td>
                      <td>
                        <div className="cycle-info">
                          <Bike size={16} className="cycle-icon" />
                          <span>{log.cycle_id}</span>
                        </div>
                      </td>
                      <td className="type-cell">{log.maintenance_type}</td>
                      <td className="employee-cell">{log.employee_name}</td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} className="date-icon" />
                          <span>{new Date(log.maintenance_date).toLocaleDateString('en-IN')}</span>
                        </div>
                      </td>
                      <td className="cost-cell">₹{log.cost}</td>
                      <td>
                        <span className={`badge status-${log.status.toLowerCase().replace(' ', '-')}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="next-due-cell">
                        {new Date(log.next_maintenance_due).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <button onClick={() => setSelectedLog(log)} className="action-btn" title="View Details">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMaintenance.length === 0 && (
              <div className="no-data">
                <Wrench size={48} className="no-data-icon" />
                <p>No maintenance records found</p>
              </div>
            )}
          </div>
        )}

        {/* Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="table-container">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Station</th>
                    <th>Quantity</th>
                    <th>Reorder Level</th>
                    <th>Unit Price</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.inventory_id} className="table-row">
                      <td><span className="record-id">{item.inventory_id}</span></td>
                      <td className="item-name-cell">
                        <Package size={16} className="package-icon" />
                        {item.item_name}
                      </td>
                      <td className="type-cell">{item.item_type}</td>
                      <td className="station-cell">{item.station_name}</td>
                      <td className="quantity-cell">
                        <span className={item.quantity <= item.reorder_level ? 'quantity-low' : 'quantity-ok'}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="reorder-cell">{item.reorder_level}</td>
                      <td className="price-cell">₹{item.unit_price}</td>
                      <td className="value-cell">₹{item.quantity * item.unit_price}</td>
                      <td>
                        <span className={`badge ${item.status === 'Low Stock' ? 'status-low-stock' : 'status-in-stock'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => setSelectedItem(item)} className="action-btn" title="View Details">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInventory.length === 0 && (
              <div className="no-data">
                <Package size={48} className="no-data-icon" />
                <p>No inventory items found</p>
              </div>
            )}
          </div>
        )}

        {/* Maintenance Detail Modal */}
        {selectedLog && (
          <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-section">
                  <h2 className="modal-title">Maintenance Details</h2>
                  <p className="modal-record-id">{selectedLog.maintenance_id}</p>
                </div>
                <button onClick={() => setSelectedLog(null)} className="modal-close">×</button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3 className="detail-title">
                    <Bike size={18} />
                    Cycle Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <p className="detail-label">Cycle ID</p>
                      <p className="detail-value detail-mono">{selectedLog.cycle_id}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Maintenance Type</p>
                      <p className="detail-value">{selectedLog.maintenance_type}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-title">
                    <Wrench size={18} />
                    Maintenance Description
                  </h3>
                  <p className="detail-description">{selectedLog.description}</p>
                </div>

                <div className="detail-grid-2">
                  <div className="detail-section">
                    <h3 className="detail-title">Employee</h3>
                    <p className="detail-value-box">{selectedLog.employee_name}</p>
                    <p className="detail-label-small">ID: {selectedLog.performed_by_emp_id}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">Status</h3>
                    <span className={`badge-large status-${selectedLog.status.toLowerCase().replace(' ', '-')}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-title">
                    <Package size={18} />
                    Parts Replaced
                  </h3>
                  <p className="detail-value-box">{selectedLog.parts_replaced}</p>
                </div>

                <div className="detail-grid-3">
                  <div className="detail-item">
                    <p className="detail-label">Maintenance Date</p>
                    <p className="detail-value">{new Date(selectedLog.maintenance_date).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="detail-item">
                    <p className="detail-label">Cost</p>
                    <p className="detail-value cost-highlight">₹{selectedLog.cost}</p>
                  </div>
                  <div className="detail-item">
                    <p className="detail-label">Next Due</p>
                    <p className="detail-value">{new Date(selectedLog.next_maintenance_due).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="action-btn-primary action-btn-edit">
                    <Edit size={18} />
                    Edit Record
                  </button>
                  <button className="action-btn-primary action-btn-download">
                    <Download size={18} />
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Detail Modal */}
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-section">
                  <h2 className="modal-title">Inventory Item Details</h2>
                  <p className="modal-record-id">{selectedItem.inventory_id}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="modal-close">×</button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3 className="detail-title">
                    <Package size={18} />
                    Item Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <p className="detail-label">Item Name</p>
                      <p className="detail-value">{selectedItem.item_name}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Type</p>
                      <p className="detail-value">{selectedItem.item_type}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Station</p>
                      <p className="detail-value">{selectedItem.station_name}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Station ID</p>
                      <p className="detail-value detail-mono">{selectedItem.station_id}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-grid-2">
                  <div className="detail-section inventory-quantity">
                    <h3 className="detail-title">Current Stock</h3>
                    <p className="stock-number">{selectedItem.quantity}</p>
                    <span className={`badge-large ${selectedItem.status === 'Low Stock' ? 'status-low-stock' : 'status-in-stock'}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div className="detail-section inventory-value">
                    <h3 className="detail-title">Total Value</h3>
                    <p className="value-number">₹{selectedItem.quantity * selectedItem.unit_price}</p>
                    <p className="detail-label-small">Unit Price: ₹{selectedItem.unit_price}</p>
                  </div>
                </div>

                <div className="detail-grid-2">
                  <div className="detail-item">
                    <p className="detail-label">Reorder Level</p>
                    <p className="detail-value-box">{selectedItem.reorder_level} units</p>
                  </div>
                  <div className="detail-item">
                    <p className="detail-label">Supplier</p>
                    <p className="detail-value-box">{selectedItem.supplier_name}</p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-title">
                    <Calendar size={18} />
                    Last Restocked
                  </h3>
                  <p className="detail-value">
                    {new Date(selectedItem.last_restocked_date).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div className="action-buttons">
                  <button className="action-btn-primary action-btn-edit">
                    <Edit size={18} />
                    Update Stock
                  </button>
                  <button className="action-btn-primary action-btn-success">
                    <TrendingUp size={18} />
                    Reorder Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceOverview;