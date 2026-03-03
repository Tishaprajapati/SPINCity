import axiosInstance from '../config/axiosConfig';

const API_BASE_URL = '/admin/dashboard';

const adminDashboardService = {

  getDashboardSummary: async () => {
    try {
      console.log('🔵 Calling API:', `${API_BASE_URL}/summary`);
      const response = await axiosInstance.get(`${API_BASE_URL}/summary`);
      console.log('✅ API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard summary:', error);
      throw error;
    }
  },

  getRecentRentals: async () => {
    try {
      console.log('🔵 Calling API:', `${API_BASE_URL}/recent-rentals`);
      const response = await axiosInstance.get(`${API_BASE_URL}/recent-rentals`);
      console.log('✅ Rentals Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching recent rentals:', error);
      throw error;
    }
  },
};

export default adminDashboardService;
