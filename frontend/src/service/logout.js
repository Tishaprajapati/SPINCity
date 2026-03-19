import axiosInstance from '../config/axiosConfig';
import { clearCustomerAuth, clearStaffAuth, isStaffPath } from '../auth/authStorage';

const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (err) {
    console.warn('Logout API failed');
  } finally {
    // Only clear the relevant auth scope.
    if (isStaffPath(window.location.pathname)) clearStaffAuth();
    else clearCustomerAuth();

    // Replace history so "Back" doesn't resurrect the old protected page.
    window.location.replace('/login');
  }
};

export default logout;
