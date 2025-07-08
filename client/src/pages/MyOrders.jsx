import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // ✅ default is []

  const { backendUrl } = useContext(AppContext); // ✅ Include backendUrl
useEffect(() => {


axios.get(`${backendUrl}/api/orders`, { withCredentials: true })
    .then((res) => {
      console.log("📥 Orders response:", res.data);
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        console.warn("⚠️ Unexpected response format");
        setOrders([]);
      }
    })
    .catch((err) => {
      console.error("❌ Error fetching orders:", err?.response?.data || err.message);
      setOrders([]);
    });
}, [backendUrl]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <ul className="mt-2">
              {order.items.map((item, i) => (
                <li key={i}>🛍️ {item.name} × {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
