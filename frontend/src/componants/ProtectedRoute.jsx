import { Navigate } from 'react-router-dom';

const normalizeRole = (role) => (role || '').replace(/^ROLE_/, '');

// ── Admin Protected Route ──
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role  = normalizeRole(localStorage.getItem('staffRole'));
  if (!token || role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Employee Protected Route ──
export const EmployeeRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role  = normalizeRole(localStorage.getItem('staffRole'));
  if (!token || !['EMPLOYEE', 'STAFF', 'MAINTENANCE'].includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Customer Protected Route ──
export const CustomerRoute = ({ children }) => {
  const token      = localStorage.getItem('token');
  const customerId = localStorage.getItem('customerId');
  if (!token || !customerId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};