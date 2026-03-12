import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/employee/empnavbar.css';

const Icons = {
  Dashboard:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Approve:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  Riders:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0113 0"/></svg>,
  Cycle:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 100-2 1 1 0 000 2z"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>,
  Customer:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Deposit:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  Revenue:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Wrench:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Alert:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  CycleList:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Service:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  Logout:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>,
  ChevronRight:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>,
  Arrow:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  Menu:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

const STATION_NAV = [
  { label: 'Dashboard',      path: '/employeedashboard', icon: 'Dashboard' },

  { label: 'Station Analytics', path: '/station-analytics', icon: 'Revenue' },

  { label: 'Cycles', icon: 'Cycle', sub: [
    { label: 'Cycle Status',  path: '/employee/cycles',        icon: 'Cycle'  },
    { label: 'Report Defect', path: '/employee/report-defect', icon: 'Wrench' },
  ]},
  { label: 'Customers', icon: 'Customer', sub: [
    { label: 'Search Customer', path: '/employee/customers', icon: 'Customer' },
  ]},
  { label: 'Deposits', path: '/employee/deposits', icon: 'Deposit' },
  { label: 'Revenue',  path: '/employee/revenue',  icon: 'Revenue'  },
];

const MAINTENANCE_NAV = [
  { label: 'Dashboard',     path: '/employeedashboard',         icon: 'Dashboard' },
  { label: 'Defect Reports', path: '/employee/defects',          icon: 'Alert',    badgeKey: 'defects'      },
  { label: 'Service Alerts', path: '/employee/service-alerts',   icon: 'Service',  badgeKey: 'serviceAlerts'},
  { label: 'All Cycles',     path: '/employee/all-cycles',       icon: 'CycleList' },
  { label: 'Maintenance',    icon: 'Wrench', sub: [
    { label: 'Complete Repair', path: '/employee/maintenance/complete', icon: 'Wrench' },
  ]},
];

const EmpNavbar = ({ onCollapse }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = localStorage.getItem('staffRole') ?? '';
  const empName   = localStorage.getItem('staffName') ?? 'Employee';
  const empId     = localStorage.getItem('staffId')   ?? '';
  const stationId = parseInt(localStorage.getItem('stationId') || localStorage.getItem('assignedStation') || '0');

  const isMaintenance = role === 'ROLE_MAINTENANCE' || role === 'MAINTENANCE';
  const navItems      = isMaintenance ? MAINTENANCE_NAV : STATION_NAV;
  const zone          = stationId >= 8 ? '8–14' : '1–7';

  const [collapsed,     setCollapsed]     = useState(false);
  const [openSub,       setOpenSub]       = useState(null);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [badges,        setBadges]        = useState({ defects: 0, serviceAlerts: 0 });

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapse) onCollapse(next);
  };

  const handleNav = (item) => {
    if (item.sub) { setOpenSub(openSub === item.label ? null : item.label); }
    else { navigate(item.path); setMobileOpen(false); }
  };

  const isActive = (path) => location.pathname === path;
  const hasActiveSub = (item) => item.sub?.some(s => isActive(s.path));

  return (
    <>
      {/* Mobile topbar */}
      <div className="enav-topbar">
        <button className="enav-topbar-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icons.Menu />
        </button>
        <span className="enav-topbar-title">SpinCity {isMaintenance ? 'Maintenance' : 'Station'}</span>
        <div className="enav-topbar-right">
          <div className="enav-avatar sm">{empName.charAt(0)}</div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && <div className="enav-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`enav-sidebar ${collapsed ? 'collapsed' : ''} ${isMaintenance ? 'maint' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        {/* Brand */}
        <div className="enav-brand">
          <div className="enav-brand-icon"><Icons.Cycle /></div>
          {!collapsed && (
            <div className="enav-brand-text">
              <span className="enav-brand-name">SpinCity</span>
              <span className="enav-brand-sub">{isMaintenance ? 'Maintenance' : 'Station'} Panel</span>
            </div>
          )}
          <button className="enav-collapse-btn" onClick={toggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="enav-profile">
            <div className="enav-avatar">{empName.charAt(0)}</div>
            <div className="enav-profile-info">
              <span className="enav-profile-name">{empName}</span>
              <span className="enav-profile-sub">
                {isMaintenance ? `Zone ${zone}` : `Station #${stationId}`}
              </span>
            </div>
            <div className={`enav-online ${isMaintenance ? 'maint' : ''}`} />
          </div>
        )}

        {/* Nav */}
        <nav className="enav-nav">
          {navItems.map((item) => {
            const Icon     = Icons[item.icon];
            const badge    = item.badgeKey ? badges[item.badgeKey] : 0;
            const active   = !item.sub && isActive(item.path);
            const subActive= hasActiveSub(item);
            const open     = openSub === item.label;

            return (
              <div key={item.label} className="enav-group">
                <button
                  className={`enav-item ${active || subActive ? 'active' : ''}`}
                  onClick={() => handleNav(item)}
                  title={collapsed ? item.label : ''}
                >
                  <span className="enav-item-icon">{Icon && <Icon />}</span>
                  {!collapsed && (
                    <>
                      <span className="enav-item-label">{item.label}</span>
                      {badge > 0 && <span className="enav-badge">{badge}</span>}
                      {item.sub && (
                        <span className={`enav-arrow ${open ? 'open' : ''}`}><Icons.Arrow /></span>
                      )}
                    </>
                  )}
                </button>

                {item.sub && !collapsed && (
                  <div className={`enav-sub ${open ? 'open' : ''}`}>
                    {item.sub.map((s) => {
                      const SubIcon = Icons[s.icon];
                      return (
                        <button
                          key={s.path}
                          className={`enav-sub-item ${isActive(s.path) ? 'active' : ''}`}
                          onClick={() => { navigate(s.path); setMobileOpen(false); }}
                        >
                          <span className="enav-item-icon sm">{SubIcon && <SubIcon />}</span>
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="enav-footer">
          {!collapsed && <span className="enav-footer-id">ID: EMP-{empId}</span>}
          <button
            className="enav-logout"
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            title="Logout"
          >
            <span className="enav-item-icon"><Icons.Logout /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default EmpNavbar;