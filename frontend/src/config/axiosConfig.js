import axios from 'axios';
import { clearCustomerAuth, clearStaffAuth, getTokenForPath, isStaffPath } from '../auth/authStorage';

const axiosInstance = axios.create({
 baseURL: 'https://spincity.onrender.com/api' ,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenForPath(window.location.pathname);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to request");
    } else {
      console.warn("⚠️ No token found");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      // Clear only the auth scope for the current app area (staff vs customer),
      // so logging in as a customer in another tab doesn't break admin (and vice versa).
      if (isStaffPath(window.location.pathname)) clearStaffAuth();
      else clearCustomerAuth();
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;