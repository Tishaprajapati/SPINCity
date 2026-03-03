import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/employee/empnavbar.css';

// Icons as SVG components for zero dependency
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Approve: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  Riders: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0113 0"/>
    </svg>
  ),
  Cycle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6a1 1 0 100-2 1 1 0 000 2z"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  ),
  Customer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Deposit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20"/><circle cx="12" cy="15" r="1"/>
    </svg>
  ),
  Revenue: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Wrench: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  CycleList: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Service: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Station: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

// ── Nav config per role ───────────────────────────────────────────────────────

const STATION_NAV = [
  {
    label: 'Dashboard',
    path: '/employeedashboard',
    icon: 'Dashboard',
    badge: null,
  },
  {
    label: 'Ride Management',
    icon: 'Approve',
    sub: [
      { label: 'Pending Approvals', path: '/employee/approvals', icon: 'Approve' },
      { label: "Today's Riders", path: '/employee/riders', icon: 'Riders' },
    ],
  },
  {
    label: 'Cycles',
    icon: 'Cycle',
    sub: [
      { label: 'Cycle Status', path: '/employee/cycles', icon: 'Cycle' },
      { label: 'Report Defect', path: '/employee/report-defect', icon: 'Wrench' },
    ],
  },
  {
    label: 'Customers',
    icon: 'Customer',
    sub: [
      { label: 'Search Customer', path: '/employee/customers', icon: 'Customer' },
    ],
  },
  {
    label: 'Deposits',
    path: '/employee/deposits',
    icon: 'Deposit',
  },
  {
    label: 'Revenue',
    path: '/employee/revenue',
    icon: 'Revenue',
  },
];

const MAINTENANCE_NAV = [
  {
    label: 'Dashboard',
    path: '/employeedashboard',
    icon: 'Dashboard',
  },
  {
    label: 'Defect Reports',
    path: '/employee/defects',
    icon: 'Alert',
    badgeKey: 'defects',
  },
  {
    label: 'Service Alerts',
    path: '/employee/service-alerts',
    icon: 'Service',
    badgeKey: 'serviceAlerts',
  },
  {
    label: 'All Cycles',
    path: '/employee/all-cycles',
    icon: 'CycleList',
  },
  {
    label: 'My Stations',
    icon: 'Station',
    sub: [
      { label: 'Station 1–7', path: '/employee/stations/1-7', icon: 'Station' },
      { label: 'Station 8–14', path: '/employee/stations/8-14', icon: 'Station' },
    ],
  },
];

// ── Main Navbar Component ─────────────────────────────────────────────────────

const EmpNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem('staffRole') ?? '';
  const empName = localStorage.getItem('staffName') ?? 'Employee';
  const empId = localStorage.getItem('staffId') ?? '';
  const stationId = parseInt(localStorage.getItem('assignedStation') ?? '0');

  // Determine employee type
  const isMaintenance = role === 'ROLE_MAINTENANCE' || role === 'MAINTENANCE';
  const navItems = isMaintenance ? MAINTENANCE_NAV : STATION_NAV;

  // For maintenance: which zone
  const maintenanceZone = stationId >= 8 ? '8–14' : '1–7';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [badges, setBadges] = useState({ defects: 0, serviceAlerts: 0 });

  // ── Fetch badge counts for maintenance ─────────────────────────────────────
  useEffect(() => {
    if (isMaintenance) {
      fetchBadgeCounts();
      const interval = setInterval(fetchBadgeCounts, 60000); // refresh every 1 min
      return () => clearInterval(interval);
    }
  }, [isMaintenance]);

  const fetchBadgeCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const [defectsRes, serviceRes] = await Promise.all([
        fetch('http://localhost:8080/api/employee/maintenance/defects', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:8080/api/employee/maintenance/due', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const defects = await defectsRes.json();
      const service = await serviceRes.json();
      setBadges({
        defects: Array.isArray(defects) ? defects.length : 0,
        serviceAlerts: Array.isArray(service) ? service.length : 0,
      });
    } catch (err) {
      console.error('Badge fetch failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (item) => {
    if (item.sub) {
      setOpenSubMenu(openSubMenu === item.label ? null : item.label);
    } else {
      navigate(item.path);
      setOpenSubMenu(null);
    }
  };

  const getBadgeCount = (item) => {
    if (!item.badgeKey) return 0;
    return badges[item.badgeKey] ?? 0;
  };

  return (
    <>
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={`emp-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>

        {/* Logo / Brand */}
        <div className="emp-brand">
          <div className="emp-brand-icon">
            <Icons.Cycle />
          </div>
          {sidebarOpen && (
            <div className="emp-brand-text">
              <span className="emp-brand-name">SpinCity</span>
              <span className="emp-brand-role">
                {isMaintenance ? 'Maintenance' : 'Station'} Panel
              </span>
            </div>
          )}
          <button className="emp-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>

        {/* Employee Info Card */}
        {sidebarOpen && (
          <div className="emp-profile-card">
            <div className="emp-avatar">{empName.charAt(0)}</div>
            <div className="emp-profile-info">
              <span className="emp-profile-name">{empName}</span>
              <span className="emp-profile-sub">
                {isMaintenance
                  ? `Zone ${maintenanceZone}`
                  : `Station #${stationId}`}
              </span>
            </div>
            <div className={`emp-status-dot ${isMaintenance ? 'maintenance' : 'station'}`} />
          </div>
        )}

        {/* Nav Items */}
        <nav className="emp-nav">
          {navItems.map((item) => {
            const badgeCount = getBadgeCount(item);
            const hasActiveSub = item.sub?.some((s) => isActive(s.path));
            const isOpen = openSubMenu === item.label;
            const IconComp = Icons[item.icon];

            return (
              <div key={item.label} className="emp-nav-group">
                <button
                  className={`emp-nav-item ${
                    (!item.sub && isActive(item.path)) || hasActiveSub ? 'active' : ''
                  }`}
                  onClick={() => handleNavClick(item)}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <span className="emp-nav-icon">
                    {IconComp && <IconComp />}
                  </span>
                  {sidebarOpen && (
                    <>
                      <span className="emp-nav-label">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className="emp-badge">{badgeCount}</span>
                      )}
                      {item.sub && (
                        <span className={`emp-arrow ${isOpen ? 'open' : ''}`}>›</span>
                      )}
                    </>
                  )}
                </button>

                {/* Sub Menu */}
                {item.sub && sidebarOpen && (
                  <div className={`emp-submenu ${isOpen ? 'open' : ''}`}>
                    {item.sub.map((sub) => {
                      const SubIcon = Icons[sub.icon];
                      return (
                        <button
                          key={sub.path}
                          className={`emp-sub-item ${isActive(sub.path) ? 'active' : ''}`}
                          onClick={() => navigate(sub.path)}
                        >
                          <span className="emp-nav-icon">
                            {SubIcon && <SubIcon />}
                          </span>
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom — Logout */}
        <div className="emp-sidebar-footer">
          {sidebarOpen && (
            <div className="emp-footer-info">
              <span>ID: EMP-{empId}</span>
            </div>
          )}
          <button className="emp-logout-btn" onClick={handleLogout} title="Logout">
            <span className="emp-nav-icon"><Icons.Logout /></span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Top Bar (mobile) ──────────────────────────────────────────────── */}
      <div className="emp-topbar">
        <button className="emp-topbar-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Icons.Menu />
        </button>
        <span className="emp-topbar-title">SpinCity {isMaintenance ? 'Maintenance' : 'Station'}</span>
        <div className="emp-topbar-right">
          <span className="emp-topbar-name">{empName}</span>
          <div className="emp-avatar small">{empName.charAt(0)}</div>
        </div>
      </div>
    </>
  );
};

export default EmpNavbar;