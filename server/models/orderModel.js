import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "Processing", // ["Processing", "Shipped", "Out for Delivery", "Delivered"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Order", orderSchema);
