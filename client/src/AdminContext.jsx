import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/admin/check-auth', { withCredentials: true });
        if (data.isAdmin) {
          setAdmin(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, []);

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/inventory', { withCredentials: true });
      setInventory(data);
    } catch (err) {
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate forecasts
  const generateForecasts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/generate-forecasts', {}, { withCredentials: true });
      setForecasts(data.forecasts);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: 'New demand forecasts generated'
      }]);
    } catch (err) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Forecast generation failed'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Update inventory stock
  const updateInventory = async (productId, newStock) => {
    try {
      await axios.put(`/api/admin/inventory/${productId}`, { stock: newStock }, { withCredentials: true });
      fetchInventory();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      if (data.success && data.user.isAdmin) {
        setAdmin(data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setAdmin(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    admin,
    inventory,
    salesData,
    forecasts,
    notifications,
    users,
    loading,
    fetchInventory,
    generateForecasts,
    updateInventory,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};