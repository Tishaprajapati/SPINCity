import axiosInstance from '../config/axiosConfig';

const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (err) {
    console.warn('Logout API failed');
  } finally {
    localStorage.clear();
    sessionStorage.clear();

    window.location.replace('/login'); // replaces history
  }
};

export default logout;
