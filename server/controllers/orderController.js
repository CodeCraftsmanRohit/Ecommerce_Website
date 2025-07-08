import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user._id;

    const newOrder = await Order.create({ user: userId, items, totalAmount });
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("📥 Getting orders for:", userId);

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    console.log("📦 Orders fetched:", orders.length);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const saveUserOrders = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    console.log("📦 Saving order:");
    console.log("🧑‍💻 User:", req.user);
    console.log("🛒 Items:", items);
    console.log("💰 Total:", totalAmount);

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      status: "Processing",
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("❌ Failed to save order:", err); // log the full error, not just `err.message`
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export  const getUserOrdersByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
