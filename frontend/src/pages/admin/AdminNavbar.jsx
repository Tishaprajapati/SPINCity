import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/admin/adminnavbar.css';
import logout from '../../service/logout';
const AdminNavbar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    if (!isCollapsed) {
      setActiveDropdown(activeDropdown === menu ? null : menu);
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

 const handleLogout = () => logout();

  const menuItems = [
    { key: 'dashboard',    icon: '📊', label: 'Dashboard',          to: '/admindashboard'   },
    { key: 'revenue', icon: '💰', label: 'Revenue', to: '/revenue' },
    { key: 'customers',    icon: '👥', label: 'Customers',           to: '/customermanagement'   },
    { key: 'cycles',       icon: '🚴', label: 'Cycle Fleet',         to: '/cyclefleetmanagement' },
    { key: 'stations',     icon: '📍', label: 'Stations',            to: '/adminstation'    },
    { key: 'employees',    icon: '👔', label: 'Employees',           to: '/employeemanagement'   },
    { key: 'feedback',     icon: '⭐', label: 'Feedback & Ratings',  to: '/feedback'    },
    { key: 'alerts',       icon: '🚨', label: 'Notifications',       to: '/alert'      },
  ];

  return (
    <div className={`admin-navbar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button className="navbar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '☰' : '✕'}
      </button>

      {/* Brand */}
      <div className="navbar-header">
        <div className="brand-logo">
          <span className="brand-spin">Spin</span>
          {!isCollapsed && <span className="brand-city">City</span>}
        </div>
        {!isCollapsed && <p className="navbar-subtitle">Admin Panel</p>}
      </div>

      {/* Menu */}
      <div className="navbar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className={`menu-item ${isActive(item.to)}`}
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="menu-text">{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Footer - Logout */}
      {!isCollapsed && (
        <div className="navbar-footer">
          <div className="menu-item logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;