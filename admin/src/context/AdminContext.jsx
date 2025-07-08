import { createContext, useEffect, useState } from "react"; // Make sure you import createContext
import axios from "axios";
import { toast } from "react-toastify";

// ✅ You must create and export this context
export const AdminContext = createContext(); // ✅ This is missing in your file!

export const AdminContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
      if (data.success) {
        setIsAdminAuthenticated(true);
        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      toast.error("Login failed");
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/is-auth`);
      setIsAdminAuthenticated(data.success);
    } catch {
      setIsAdminAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/logout`);
      if (data.success) {
        setIsAdminAuthenticated(false);
        toast.success("Logged out successfully");
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        backendUrl,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
