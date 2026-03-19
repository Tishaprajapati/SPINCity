export const AUTH_KEYS = {
  staffToken: 'staffToken',
  staffRole: 'staffRole',
  staffId: 'staffId',
  staffName: 'staffName',
  stationId: 'stationId',

  customerToken: 'customerToken',
  customerId: 'customerId',
  customerName: 'customerName',

  // legacy (kept for backward compatibility while migrating)
  legacyToken: 'token',
};


const STAFF_PATHS = new Set([
  '/admindashboard',
  '/employeedashboard',
  '/maintenancedashboard',
  '/customermanagement',
  '/cyclefleetmanagement',
  '/adminstation',
  '/employeemanagement',
  '/feedback',
  '/alert',
  '/revenue',
  '/station-analytics',
  '/employee/cycles',
  '/employee/report-defect',
  '/employee/customers',
  '/employee/deposits',
  '/employee/revenue',
  '/employee/defects',
  '/employee/service-alerts',
  '/employee/all-cycles',
  '/employee/maintenance/complete',
  '/activerental',
  '/cyclemanagement',
  '/stationmanagement',
  '/maintanencelogging',
  '/maintenancedashboard',
]);

export function isStaffPath(pathname = '') {
  if (!pathname) return false;
  if (STAFF_PATHS.has(pathname)) return true;
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/employee') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/station') ||
    pathname.startsWith('/revenue') ||
    pathname.startsWith('/activerental') ||
    pathname.startsWith('/cycle') ||
    pathname.startsWith('/maintanence')
  );
}

export function getTokenForPath(pathname = window.location.pathname) {
  const staffToken =
    localStorage.getItem(AUTH_KEYS.staffToken) ||
    sessionStorage.getItem(AUTH_KEYS.staffToken);
  const customerToken =
    localStorage.getItem(AUTH_KEYS.customerToken) ||
    sessionStorage.getItem(AUTH_KEYS.customerToken);

  if (isStaffPath(pathname)) return staffToken || localStorage.getItem(AUTH_KEYS.legacyToken);
  return customerToken || localStorage.getItem(AUTH_KEYS.legacyToken);
}

export function setStaffAuth({ token, role, user }) {
  localStorage.setItem(AUTH_KEYS.staffToken, token);
  localStorage.setItem(AUTH_KEYS.staffRole, role);
  if (user?.id != null) localStorage.setItem(AUTH_KEYS.staffId, String(user.id));
  if (user?.name != null) localStorage.setItem(AUTH_KEYS.staffName, String(user.name));
  if (user?.assignedStation != null) localStorage.setItem(AUTH_KEYS.stationId, String(user.assignedStation));
  // Stop overwriting the shared legacy key; remove if present.
  localStorage.removeItem(AUTH_KEYS.legacyToken);
}

export function setCustomerAuth({ token, user }) {
  localStorage.setItem(AUTH_KEYS.customerToken, token);
  if (user?.customerId != null) localStorage.setItem(AUTH_KEYS.customerId, String(user.customerId));
  if (user?.customerName != null) localStorage.setItem(AUTH_KEYS.customerName, String(user.customerName));
  localStorage.removeItem(AUTH_KEYS.legacyToken);
}

export function clearStaffAuth() {
  localStorage.removeItem(AUTH_KEYS.staffToken);
  localStorage.removeItem(AUTH_KEYS.staffRole);
  localStorage.removeItem(AUTH_KEYS.staffId);
  localStorage.removeItem(AUTH_KEYS.staffName);
  localStorage.removeItem(AUTH_KEYS.stationId);
  sessionStorage.removeItem(AUTH_KEYS.staffToken);
}

export function clearCustomerAuth() {
  localStorage.removeItem(AUTH_KEYS.customerToken);
  localStorage.removeItem(AUTH_KEYS.customerId);
  localStorage.removeItem(AUTH_KEYS.customerName);
  sessionStorage.removeItem(AUTH_KEYS.customerToken);
}
