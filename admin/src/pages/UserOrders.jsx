import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const statusOptions = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const UserOrders = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/user/${userId}`);
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user orders");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.patch(`${backendUrl}/api/orders/update-status/${orderId}`, { status: newStatus });
      if (data.success) {
        toast.success("Status updated");
        fetchOrders(); // Refresh after update
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow bg-white">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ${order.totalAmount}</p>
              <p><strong>Items:</strong> {order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</p>
              <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Status:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
