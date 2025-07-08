import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Success = () => {
  const { setEcoCart, isLoggedin, backendUrl } = useContext(AppContext); // ✅ Include backendUrl

  useEffect(() => {
    console.log("🟢 useEffect on Success page triggered");

    const saveOrder = async () => {
      try {
        // ✅ 1. Get cart items
        const cartRes = await axios.get(`${backendUrl}/api/cart/`, {
          withCredentials: true,
        });

        const cartItems = cartRes.data?.ecoCart || [];

        if (cartItems.length === 0) {
          console.warn("⚠️ No items in cart to save as order");
          return;
        }

        // ✅ 2. Format items for order
        const formattedItems = cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1, // Replace with correct quantity if tracked
        }));

        const totalAmount = formattedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // ✅ 3. Save order
        const orderRes = await axios.post(
          `${backendUrl}/api/orders/save`,
          { items: formattedItems, totalAmount },
          { withCredentials: true }
        );

        console.log("🧾 Order saved:", orderRes.data);

        // ✅ 4. Clear cart from DB
try {
  await axios.post(`${backendUrl}/api/cart/clear`, {}, { withCredentials: true });
} catch (err) {
  console.error("❌ Cart clear error:", err?.response?.data || err.message);
}

        // ✅ 5. Clear frontend cart
        setEcoCart([]);

        toast.success("🎉 Order placed successfully!");
      } catch (err) {
        console.error("❌ Saving order failed:", err?.response?.data || err.message);
        toast.error("❌ Failed to save order.");
      }
    };

    if (isLoggedin) {
      saveOrder();
    }
  }, [isLoggedin]);

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
