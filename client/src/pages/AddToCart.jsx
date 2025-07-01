import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import {loadStripe} from "@stripe/stripe-js"


const AddToCart = () => {
  const apiURL=import.meta.env.VITE_BACKEND_URL
  const { ecoCart, removeFromEcoCart, setEcoCart } = useContext(AppContext);

  // Maintain quantity per product
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    ecoCart.forEach((item) => {
      initial[item._id] = 1;
    });
    return initial;
  });

  // Update quantity state when cart changes
  React.useEffect(() => {
    const updated = {};
    ecoCart.forEach((item) => {
      updated[item._id] = quantities[item._id] || 1;
    });
    setQuantities(updated);
  }, [ecoCart]);

  const handleRemove = (productId) => {
    removeFromEcoCart(productId);
    toast.warn("❌ Item removed from Eco Cart");
  };

  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  const totalCost = ecoCart.reduce(
    (sum, item) => sum + (item.price || 0) * quantities[item._id],
    0
  );

  const totalSavings = ecoCart.reduce((sum, item) => {
    const standardPrice = (item.originalPrice || item.price || 0) * quantities[item._id];
    const ecoPrice = (item.price || 0) * quantities[item._id];
    return sum + (standardPrice - ecoPrice);
  }, 0);

  const handlePayment = async() => {
    toast.success("🧾 Proceeding to payment...");
    const stripe=await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
     const body = {
  products: ecoCart.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: quantities[item._id],
    coverImage: item.coverImage,
  })),
};

     const headers={
      "Content-Type":"application/json"
     }
     const response=await fetch(`${apiURL}/api/create-checkout-session`,{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
     })
     const session=await response.json();
     const result=stripe.redirectToCheckout({
      sessionId:session.id
     })
     if(result.error){
      console.log(result.error);
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
        <div className="space-y-4 transition-all duration-300">
          {ecoCart.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between transition hover:shadow-lg"
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
                    Price: ${item.price?.toFixed(2) || "0.00"} × {quantities[item._id]}
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mt-3"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
