import axiosInstance from '../config/axiosConfig';

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const fetchDashboardSummary = async (stationId) => {
  const res = await axiosInstance.get(`/employee/dashboard/${stationId}`);
  return res.data;
};

// ── Approvals ─────────────────────────────────────────────────────────────────

export const fetchPendingApprovals = async (stationId) => {
  const res = await axiosInstance.get(`/employee/approvals/${stationId}`);
  return res.data;
};

export const approveRide = async (transactionId, empId, action) => {
  const res = await axiosInstance.put(
    `/employee/approvals/${transactionId}/action?empId=${empId}&action=${action}`
  );
  return res.data;
};

// ── Riders ────────────────────────────────────────────────────────────────────

export const fetchTodaysRiders = async (stationId) => {
  const res = await axiosInstance.get(`/employee/riders/${stationId}`);
  return res.data;
};

// ── Customer Details ──────────────────────────────────────────────────────────

export const fetchCustomerDetails = async (customerId) => {
  const res = await axiosInstance.get(`/employee/customer/${customerId}`);
  return res.data;
};

// ── Cycle Condition ───────────────────────────────────────────────────────────

export const fetchCycleConditions = async (stationId) => {
  const res = await axiosInstance.get(`/employee/cycles/conditions/${stationId}`);
  return res.data;
};

export const reportDefect = async (cycleId, conditionNote, conditionStatus, empId) => {
  const res = await axiosInstance.post(
    `/employee/cycles/report-defect?empId=${empId}`,
    { cycleId, conditionNote, conditionStatus }
  );
  return res.data;
};

// ── Deposit ───────────────────────────────────────────────────────────────────

export const collectDeposit = async (transactionId) => {
  const res = await axiosInstance.put(`/employee/deposit/collect/${transactionId}`);
  return res.data;
};

export const returnDeposit = async (transactionId) => {
  const res = await axiosInstance.put(`/employee/deposit/return/${transactionId}`);
  return res.data;
};

// ── Maintenance ───────────────────────────────────────────────────────────────

export const fetchAllDefects = async () => {
  const res = await axiosInstance.get(`/employee/maintenance/defects`);
  return res.data;
};

export const fetchCyclesDueForService = async () => {
  const res = await axiosInstance.get(`/employee/maintenance/due`);
  return res.data;
};

export const completeMaintenance = async (maintenanceId, empId, partsReplaced, cost) => {
  const res = await axiosInstance.put(
    `/employee/maintenance/complete/${maintenanceId}?empId=${empId}&partsReplaced=${partsReplaced}&cost=${cost}`
  );
  return res.data;
};

export const updateCycleStatus = async (cycleId, status) => {
  const res = await axiosInstance.put(
    `/employee/maintenance/cycle-status/${cycleId}?status=${status}`
  );
  return res.data;
};