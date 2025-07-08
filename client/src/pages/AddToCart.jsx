import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // ✅ Make sure it's in your .env

const AddToCart = () => {
  const { ecoCart, removeFromEcoCart, backendUrl } = useContext(AppContext);

  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    ecoCart.forEach((item) => {
      initial[item._id] = 1;
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updated = {};
    ecoCart.forEach((item) => {
      updated[item._id] = quantities[item._id] || 1;
    });
    setQuantities(updated);
  }, [ecoCart]);

  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  const handleRemove = (id) => {
    removeFromEcoCart(id);
    toast.warn("❌ Item removed from Eco Cart");
  };

  const totalCost = ecoCart.reduce(
    (sum, item) => sum + (item.price || 0) * quantities[item._id],
    0
  );

  const totalSavings = ecoCart.reduce((sum, item) => {
    const original = (item.originalPrice || item.price || 0) * quantities[item._id];
    const eco = (item.price || 0) * quantities[item._id];
    return sum + (original - eco);
  }, 0);

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (ecoCart.length === 0) return;

      const products = ecoCart.map((item) => ({
        name: item.name,
        coverImage: item.coverImage,
        price: item.price,
        quantity: quantities[item._id],
      }));

      const response = await fetch(`${backendUrl}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Payment session creation failed");
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id }); // ✅ Real Stripe redirect
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("❌ Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-green-700 text-center animate-bounce">
        🛒 Eco Cart
      </h1>

      {ecoCart.length === 0 ? (
        <p className="text-center text-gray-500">Your Eco Cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {ecoCart.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              <div className="flex gap-4 items-center w-full md:w-2/3">
                <img
                  src={item.coverImage || "https://picsum.photos/100"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">EcoScore: {item.ecoScore}</p>
                  <p className="text-sm text-gray-600">
                    Price: ${item.price?.toFixed(2)} × {quantities[item._id]}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => decrementQty(item._id)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[24px] text-center">{quantities[item._id]}</span>
                <button
                  onClick={() => incrementQty(item._id)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <div className="text-right mt-6 space-y-2 border-t pt-4">
            <div className="text-lg font-semibold text-green-800">
              Total: ${totalCost.toFixed(2)}
            </div>
            {totalSavings > 0 && (
              <div className="text-sm text-green-600">
                🎉 You saved ${totalSavings.toFixed(2)} by choosing eco-products!
              </div>
            )}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mt-3 disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
