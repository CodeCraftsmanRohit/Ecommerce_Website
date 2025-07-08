// controllers/paymentController.js
import Stripe from "stripe";

// 🔐 Validate and create Stripe instance
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("❌ STRIPE_SECRET_KEY not defined in .env");
}
const stripe = new Stripe(stripeSecret);

// 💱 Default currency fallback
const currency = (process.env.CURRENCY || "usd").toLowerCase();

export const purchaseProduct = async (req, res) => {
  try {
    const origin = req.headers.origin || "http://localhost:5173";
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ success: false, message: "Invalid product payload." });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency,
        product_data: {
          name: product.name,
          images: [product.coverImage || "https://via.placeholder.com/100"],
        },
        unit_amount: Math.round(product.price * 100), // cents/paise
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    return res.status(200).json({ success: true, id: session.id });
  } catch (err) {
    console.error("Stripe purchase error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
