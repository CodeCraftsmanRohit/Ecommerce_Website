// controllers/cartController.js
import User from "../models/usermodel.js";

// ➤ Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
const user = await User.findById(req.userId); // ✅ Correct

    if (!user.ecoCart.includes(productId)) {
      user.ecoCart.push(productId);
      await user.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

// ➤ Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.userId);

    user.ecoCart = user.ecoCart.filter(p => p.toString() !== productId);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove from cart" });
  }
};

// ➤ Get all products in cart
// ✅ Update getCart
export const getCart = async (req, res) => {
  try {
    // console.log("🟡 Fetching cart for user:", req.userId);
    const user = await User.findById(req.userId).populate("ecoCart");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, ecoCart: user.ecoCart });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};
export const clearCart = async (req, res) => {
  try {
    
    const userId = req.userId;


    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    await User.updateOne({ _id: userId }, { $set: { ecoCart: [] } });

    console.log("✅ Cart cleared via updateOne");
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("❌ Error clearing cart:", error.message);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};

