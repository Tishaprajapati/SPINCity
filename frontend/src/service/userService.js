// =====================================================
// FILE: src/service/userService.js
// =====================================================

import axiosInstance from "../config/axiosConfig";
import { getTokenForPath } from "../auth/authStorage";

const userService = {
  // ==========================================
  // STATIONS  →  /api/user/stations
  // ==========================================

  getAllStations: async () => {
    const response = await axiosInstance.get("/user/stations");
    return response.data;
  },

  getNearbyStations: async (lat, lng, radius = 5) => {
    const response = await axiosInstance.get(
      `/user/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    );
    return response.data;
  },

  getStationCycles: async (stationId) => {
    const response = await axiosInstance.get(
      `/user/stations/${stationId}/cycles`,
    );
    return response.data;
  },

  // ==========================================
  // CYCLES  →  /api/cycles/performance
  // ==========================================

  getAllAvailableCycles: async () => {
    const response = await axiosInstance.get("/cycles/performance/all");
    return response.data;
  },

  getCycleById: async (cycleId) => {
    const response = await axiosInstance.get(`/cycles/performance/${cycleId}`);
    return response.data;
  },

  // ==========================================
  // DASHBOARD  →  /api/user/dashboard
  // ==========================================

  getDashboard: async (customerId) => {
    const response = await axiosInstance.get(`/user/dashboard/${customerId}`);
    return response.data;
  },

  // ==========================================
  // WALLET  →  /api/user/wallet
  // ==========================================

  rechargeWallet: async (customerId, amount, paymentMethod) => {
    const response = await axiosInstance.post("/user/wallet/recharge", {
      customerId,
      amount,
      paymentMethod,
    });
    return response.data;
  },

  getWalletTransactions: async (customerId) => {
    const response = await axiosInstance.get(
      `/user/wallet/transactions/${customerId}`,
    );
    return response.data;
  },

  getWalletBalance: async (customerId) => {
    const response = await axiosInstance.get(
      `/user/wallet/balance/${customerId}`,
    );
    return response.data;
  },

  upgradeMembership: async (customerId, membershipPlanId) => {
    const response = await axiosInstance.post(
      // ✅ Use axiosInstance
      `/user/membership/upgrade?customerId=${customerId}`,
      { membershipPlanId },
    );
    return response.data;
  },

  // getCurrentMembership(customerId) {
  //   return axios.get(`/user/membership/current?customerId=${customerId}`);
  // },

  updatePaymentStatus: async (transactionId, status) => {
  const token = getTokenForPath(window.location.pathname);
  const response = await fetch(
    `http://localhost:8080/api/employee/payment-status/${transactionId}?status=${status}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.text();
},


  cancelMembership: async (customerId) => {
    const response = await axiosInstance.post(
      // ✅ Use axiosInstance
      `/user/membership/cancel?customerId=${customerId}`,
    );
    return response.data;
  },

  // ==========================================
  // RENTALS  →  /api/user/rentals
  // ==========================================

  getActiveRental: async (customerId) => {
    const response = await axiosInstance.get(
      `/user/rentals/active/${customerId}`,
    );
    return response.data;
  },

  getRentalHistory: async (customerId) => {
    const response = await axiosInstance.get(
      `/user/rentals/history/${customerId}`,
    );
    return response.data;
  },



  endRental: async (transactionId, returnStationId) => {
    const response = await axiosInstance.post(
      `/user/rentals/end/${transactionId}`,
      {
        returnStationId,
      },
    );
    return response.data;
  },

  // ==========================================
  // PROFILE  →  /api/user/profile
  // ==========================================

  getProfile: async (customerId) => {
    const response = await axiosInstance.get(`/user/profile/${customerId}`);
    return response.data;
  },

  updateProfile: async (customerId, profileData) => {
    const response = await axiosInstance.put(
      `/user/profile/${customerId}`,
      profileData,
    );
    return response.data;
  },

  getCurrentMembership: async (customerId) => {
    const response = await axiosInstance.get(
      `/user/membership/current?customerId=${customerId}`,
    );
    return response.data;
  },

  getMembershipPlans: async () => {
    const response = await axiosInstance.get(`/user/membership/plans`);
    return response.data;
  },
startRental: async (customerId, cycleId, pickupStationId, returnStationId, expectedReturnTime,bookedAmount) => {
  const token = getTokenForPath(window.location.pathname);
  const response = await fetch("http://localhost:8080/api/user/rentals/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: parseInt(customerId),
      cycleId: parseInt(cycleId),
      pickupStationId: parseInt(pickupStationId),
      returnStationId: parseInt(returnStationId),       // ✅ already there
      expectedReturnTime: expectedReturnTime,     
        bookedAmount: parseFloat(bookedAmount),        // ✅ add
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error:", errorText);
    throw new Error("Failed to start rental");
  }
  return response.json();
},
  getActiveRental: async (customerId) => {
    const token = getTokenForPath(window.location.pathname);
    const response = await fetch(
      `http://localhost:8080/api/user/rentals/active/${customerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error("No active rental found");
    return response.json();
  },

  // End a rental
 endRental: async (rentalId, returnStationId) => {
  const token = getTokenForPath(window.location.pathname);
  const response = await fetch(
    `http://localhost:8080/api/user/rentals/end/${rentalId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ returnStationId: parseInt(returnStationId) }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Backend end rental error:", errorText); // ✅ shows exact reason
    throw new Error("Failed to end rental");
  }
  return response.json();
},

// ==========================================
// FEEDBACK  →  /api/user/feedback
// ==========================================

submitFeedback: async (feedbackData) => {
  const response = await axiosInstance.post('/user/feedback/submit', feedbackData);
  return response.data;
},

getCustomerFeedback: async (customerId) => {
  const response = await axiosInstance.get(`/user/feedback/customer/${customerId}`);
  return response.data;
},

checkRideStatus: async (transactionId) => {
  const token = getTokenForPath(window.location.pathname);
  const response = await fetch(
    `http://localhost:8080/api/employee/ride-status/${transactionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.text();
},

checkApprovalStatus: async (transactionId) => {
  const token = getTokenForPath(window.location.pathname);
  const response = await fetch(
    `http://localhost:8080/api/employee/approval-status/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const status = await response.text();
  return status;
},

};

export default userService;
