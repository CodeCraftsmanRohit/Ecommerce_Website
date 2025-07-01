import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = process.env.CURRENCY.toLowerCase();


export const purchaseProduct = async (req, res) => {
  try {
    /* 1️⃣ Validate payload */
    const origin = req.headers.origin || "http://localhost:5173";
    const { products } = req.body;
    if (!products) {
      return res.status(400).json({ success: false, message: "product is required" });
    }

   const lineItems=products.map((product)=>({
          price_data: {
            currency,
            product_data: { name: product.name ,
              images:[product.coverImage]
            },
            unit_amount:  Math.round(product.price * 100),   // paise / cents
          },
          quantity:product.quantity,
        }))

    
   

  

    /* 5️⃣ Build Stripe Checkout Session */
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"], 
      line_items:lineItems,
      mode:        "payment",
      success_url: `${origin}/success`,
      cancel_url:  `${origin}/cancel`,
      
    });


    return res.status(200).json({ success: true, id: session.id, });

  } catch (err) {
    console.error("Stripe purchase error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
