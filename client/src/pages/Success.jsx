import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Success = () => {
    const apiURL=import.meta.env.VITE_BACKEND_URL
  const { setEcoCart, isLoggedin } = useContext(AppContext);

 useEffect(() => {
  console.log("🟢 useEffect on Success page triggered");

  setEcoCart([]);

  const clearServerCart = async () => {
  console.log("🟡 clearServerCart() triggered");
  try {
    const response = await axios.post(
      `${apiURL}/api/cart/clear`,
      {},
      { withCredentials: true } // ✅ Send the cookie!
    );
    console.log("🟢 clearCart response:", response.data);
  } catch (error) {
    console.error("❌ Error clearing cart:", error?.response?.data || error.message);
  }
};

  clearServerCart(); // ✅ Always try
}, []);



  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your eco-friendly purchase. Your cart has been cleared.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Success;
