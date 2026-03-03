import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../style/admin/AdminNavbar.css';

const AdminNavbar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    if (!isCollapsed) {
      setActiveDropdown(activeDropdown === menu ? null : menu);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className={`admin-navbar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button className="navbar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '☰' : '✕'}
      </button>

      <div className="navbar-header">
        <div className="brand-logo">
          <span className="brand-spin">Spin</span>
          {!isCollapsed && <span className="brand-city">City</span>}
        </div>
        {!isCollapsed && <p className="navbar-subtitle">Admin Panel</p>}
      </div>

      <div className="navbar-menu">
        {/* Dashboard */}
        <Link to="/admin/dashboard" className={`menu-item ${isActive('/admin/dashboard')}`}>
          <span className="menu-icon">📊</span>
          {!isCollapsed && <span className="menu-text">Dashboard</span>}
        </Link>

        {/* Customer Management Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'customers' ? 'open' : ''}`}
            onClick={() => toggleDropdown('customers')}
          >
            <span className="menu-icon">👥</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Customers</span>
                <span className="dropdown-arrow">{activeDropdown === 'customers' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'customers' && (
            <div className="dropdown-menu">
              <Link to="/admin/customers" className={`dropdown-item ${isActive('/admin/customers')}`}>
                <span className="dropdown-icon">📋</span>
                Customer Management
              </Link>
            </div>
          )}
        </div>

        {/* Cycles Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'cycles' ? 'open' : ''}`}
            onClick={() => toggleDropdown('cycles')}
          >
            <span className="menu-icon">🚴</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Cycles</span>
                <span className="dropdown-arrow">{activeDropdown === 'cycles' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'cycles' && (
            <div className="dropdown-menu">
              <Link to="/admin/cycle-fleet" className={`dropdown-item ${isActive('/admin/cycle-fleet')}`}>
                <span className="dropdown-icon">🚲</span>
                Cycle Fleet Management
              </Link>
            </div>
          )}
        </div>

        {/* Stations Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'stations' ? 'open' : ''}`}
            onClick={() => toggleDropdown('stations')}
          >
            <span className="menu-icon">📍</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Stations</span>
                <span className="dropdown-arrow">{activeDropdown === 'stations' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'stations' && (
            <div className="dropdown-menu">
              <Link to="/admin/stations" className={`dropdown-item ${isActive('/admin/stations')}`}>
                <span className="dropdown-icon">🏢</span>
                Station Management
              </Link>
            </div>
          )}
        </div>

        {/* Rentals Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'rentals' ? 'open' : ''}`}
            onClick={() => toggleDropdown('rentals')}
          >
            <span className="menu-icon">🎫</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Rentals</span>
                <span className="dropdown-arrow">{activeDropdown === 'rentals' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'rentals' && (
            <div className="dropdown-menu">
              <Link to="/admin/rental-transactions" className={`dropdown-item ${isActive('/admin/rental-transactions')}`}>
                <span className="dropdown-icon">💳</span>
                Rental Transaction Management
              </Link>
            </div>
          )}
        </div>

        {/* Payments Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'payments' ? 'open' : ''}`}
            onClick={() => toggleDropdown('payments')}
          >
            <span className="menu-icon">💰</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Payments</span>
                <span className="dropdown-arrow">{activeDropdown === 'payments' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'payments' && (
            <div className="dropdown-menu">
              <Link to="/admin/payments" className={`dropdown-item ${isActive('/admin/payments')}`}>
                <span className="dropdown-icon">💵</span>
                Payment Management
              </Link>
            </div>
          )}
        </div>

        {/* Maintenance Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'maintenance' ? 'open' : ''}`}
            onClick={() => toggleDropdown('maintenance')}
          >
            <span className="menu-icon">🔧</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Maintenance</span>
                <span className="dropdown-arrow">{activeDropdown === 'maintenance' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'maintenance' && (
            <div className="dropdown-menu">
              <Link to="/admin/maintenance" className={`dropdown-item ${isActive('/admin/maintenance')}`}>
                <span className="dropdown-icon">🛠️</span>
                Maintenance Overview
              </Link>
            </div>
          )}
        </div>

        {/* Employees Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'employees' ? 'open' : ''}`}
            onClick={() => toggleDropdown('employees')}
          >
            <span className="menu-icon">👔</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Employees</span>
                <span className="dropdown-arrow">{activeDropdown === 'employees' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'employees' && (
            <div className="dropdown-menu">
              <Link to="/admin/employees" className={`dropdown-item ${isActive('/admin/employees')}`}>
                <span className="dropdown-icon">👨‍💼</span>
                Employee Management
              </Link>
            </div>
          )}
        </div>

        {/* Feedback Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'feedback' ? 'open' : ''}`}
            onClick={() => toggleDropdown('feedback')}
          >
            <span className="menu-icon">⭐</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Feedback</span>
                <span className="dropdown-arrow">{activeDropdown === 'feedback' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'feedback' && (
            <div className="dropdown-menu">
              <Link to="/admin/feedback" className={`dropdown-item ${isActive('/admin/feedback')}`}>
                <span className="dropdown-icon">📝</span>
                Feedback & Ratings
              </Link>
            </div>
          )}
        </div>

        {/* Alerts Dropdown */}
        <div className="menu-group">
          <div 
            className={`menu-item dropdown-toggle ${activeDropdown === 'alerts' ? 'open' : ''}`}
            onClick={() => toggleDropdown('alerts')}
          >
            <span className="menu-icon">🚨</span>
            {!isCollapsed && (
              <>
                <span className="menu-text">Alerts</span>
                <span className="dropdown-arrow">{activeDropdown === 'alerts' ? '▼' : '▶'}</span>
              </>
            )}
          </div>
          {!isCollapsed && activeDropdown === 'alerts' && (
            <div className="dropdown-menu">
              <Link to="/admin/alerts" className={`dropdown-item ${isActive('/admin/alerts')}`}>
                <span className="dropdown-icon">⚠️</span>
                Alert Management
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      {!isCollapsed && (
        <div className="navbar-footer">
          <div className="menu-item logout-btn">
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;