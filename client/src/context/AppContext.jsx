import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Axios instance with base URL and credentials
  const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
  });

  // 🔄 Global states
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ecoCart, setEcoCart] = useState([]);

  // 🔁 Fetch Eco Cart items from backend
  const fetchEcoCart = async () => {
    try {
      const { data } = await axiosInstance.get(`${backendUrl}/api/cart/`);
      if (data.success) setEcoCart(data.ecoCart);
    } catch (err) {
      console.error("❌ Failed to fetch cart", err.message);
    }
  };

  // ➕ Add item to Eco Cart
  const addToEcoCart = async (product) => {
    if (ecoCart.some((p) => p._id === product._id)) {
      toast.info("Product already in Eco Cart");
      return;
    }

    try {
      if (isLoggedin) {
        const res = await axiosInstance.post(`/api/cart/add`, {
          productId: product._id,
        });

        if (res.data.success) {
          setEcoCart((prev) => [...prev, product]);
          toast.success(`${product.name} added to Eco Cart ✅`);
        } else {
          throw new Error("Failed to sync with server");
        }
      } else {
        // Guest users
        setEcoCart((prev) => [...prev, product]);
        toast.success(`${product.name} added to Eco Cart ✅`);
      }
    } catch (err) {
      console.error("❌ Cart Add Error:", err.message);
      toast.error("❌ Failed to add product to cart");
    }
  };

  // ➖ Remove item from Eco Cart
  const removeFromEcoCart = async (productId) => {
    setEcoCart((prev) => prev.filter((item) => item._id !== productId));
    if (isLoggedin) {
      await axiosInstance.post(`${backendUrl}/api/cart/remove`, { productId });
    }
  };

  useEffect(() => {
    if (isLoggedin) fetchEcoCart();
  }, [isLoggedin]);

  // 🔐 Check if user is authenticated
  const getAuthState = async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData(false); // ✅ Silent fetch (no toast unless called manually)
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.error(
        "❌ Auth check failed:",
        error?.response?.data?.message || error.message
      );
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  // 👤 Fetch user profile data
  const getUserData = async (showToast = true) => {
    try {
      const { data } = await axiosInstance.get("/api/user/data");
      if (data.success) {
        setUserData(data.userData);
        console.log("✅ User data loaded:", data.userData);
      } else if (showToast) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Failed to load user data:", error.message);
      if (showToast) {
        toast.error("User not found or not logged in");
      }
    }
  };

  // 🔁 On App Load
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    ecoCart,
    addToEcoCart,
    removeFromEcoCart,
    setEcoCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
