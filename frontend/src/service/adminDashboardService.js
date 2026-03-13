import axiosInstance from '../config/axiosConfig';

// ── Dashboard ──────────────────────────────────────────────────────
const adminDashboardService = {
  getDashboardSummary: async () => {
    const res = await axiosInstance.get('/admin/dashboard/summary');
    return res.data;
  },
  getRecentRentals: async () => {
    const res = await axiosInstance.get('/admin/dashboard/recent-rentals');
    return res.data;
  },
};

// ── Cycles ─────────────────────────────────────────────────────────
export const cycleService = {
  getAll: async () => {
    const res = await axiosInstance.get('/admin/cycles');
    return res.data;
  },
  add: async (cycleData) => {
    const res = await axiosInstance.post('/admin/cycles', cycleData);
    return res.data;
  },
  update: async (cycleId, cycleData) => {
    const res = await axiosInstance.put(`/admin/cycles/${cycleId}`, cycleData);
    return res.data;
  },
  delete: async (cycleId) => {
    const res = await axiosInstance.delete(`/admin/cycles/${cycleId}`);
    return res.data;
  },
  transfer: async (cycleId, stationId) => {
    const res = await axiosInstance.put(`/admin/cycles/${cycleId}/transfer?stationId=${stationId}`);
    return res.data;
  },
  updateStatus: async (cycleId, status) => {
    const res = await axiosInstance.put(`/admin/cycles/${cycleId}/status?status=${status}`);
    return res.data;
  },
};

// ── Stations ───────────────────────────────────────────────────────
export const stationService = {
  getAll: async () => {
    const res = await axiosInstance.get('/admin/stations');
    return res.data;
  },
  add: async (stationData) => {
    const res = await axiosInstance.post('/admin/stations', stationData);
    return res.data;
  },
  update: async (stationId, stationData) => {
    const res = await axiosInstance.put(`/admin/stations/${stationId}`, stationData);
    return res.data;
  },
  delete: async (stationId) => {
    const res = await axiosInstance.delete(`/admin/stations/${stationId}`);
    return res.data;
  },
};

// ── Employees ──────────────────────────────────────────────────────
export const employeeService = {
  getAll: async () => {
    const res = await axiosInstance.get('/admin/employees');
    return res.data;
  },
  add: async (empData) => {
    const res = await axiosInstance.post('/admin/employees', empData);
    return res.data;
  },
  update: async (empId, empData) => {
    const res = await axiosInstance.put(`/admin/employees/${empId}`, empData);
    return res.data;
  },
  delete: async (empId) => {
    const res = await axiosInstance.delete(`/admin/employees/${empId}`);
    return res.data;
  },
};

// ── Customers ──────────────────────────────────────────────────────
export const customerService = {
  getAll: async () => {
    const res = await axiosInstance.get('/admin/customers');
    return res.data;
  },
  block: async (customerId) => {
    const res = await axiosInstance.put(`/admin/customers/${customerId}/block`);
    return res.data;
  },
  unblock: async (customerId) => {
    const res = await axiosInstance.put(`/admin/customers/${customerId}/unblock`);
    return res.data;
  },
};

// ── Notifications ──────────────────────────────────────────────────
export const notificationService = {
  sendToAll: async (message, title) => {
    const res = await axiosInstance.post('/admin/notifications/send-all', { message, title });
    return res.data;
  },
  sendToCustomer: async (customerId, message, title) => {
    const res = await axiosInstance.post(`/admin/notifications/send/${customerId}`, { message, title });
    return res.data;
  },
  getAll: async () => {
    const res = await axiosInstance.get('/admin/notifications');
    return res.data;
  },
};

// ── Revenue ────────────────────────────────────────────────────────
export const revenueService = {
  getStationRevenue: async () => {
    const res = await axiosInstance.get('/admin/revenue/stations');
    return res.data;
  },
  getWeeklyRevenue: async () => {
    const res = await axiosInstance.get('/admin/revenue/weekly');
    return res.data;
  },
  getMonthlyRevenue: async () => {
    const res = await axiosInstance.get('/admin/revenue/monthly');
    return res.data;
  },
};

export default adminDashboardService;