import { Navigate } from 'react-router-dom';
import { AUTH_KEYS } from '../auth/authStorage';

const normalizeRole = (role) => (role || '').replace(/^ROLE_/, '');

// ── Admin Protected Route ──
export const AdminRoute = ({ children }) => {
   const token =
    localStorage.getItem(AUTH_KEYS.staffToken) ||
    sessionStorage.getItem(AUTH_KEYS.staffToken);
  const role = normalizeRole(localStorage.getItem(AUTH_KEYS.staffRole));
  if (!token || role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Employee Protected Route ──
export const EmployeeRoute = ({ children }) => {
  const token =
    localStorage.getItem(AUTH_KEYS.staffToken) ||
    sessionStorage.getItem(AUTH_KEYS.staffToken);
  const role = normalizeRole(localStorage.getItem(AUTH_KEYS.staffRole));
  if (!token || !['EMPLOYEE', 'STAFF', 'MAINTENANCE'].includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Customer Protected Route ──
export const CustomerRoute = ({ children }) => {
  const token =
    localStorage.getItem(AUTH_KEYS.customerToken) ||
    sessionStorage.getItem(AUTH_KEYS.customerToken);
  const customerId = localStorage.getItem(AUTH_KEYS.customerId);
  if (!token || !customerId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};