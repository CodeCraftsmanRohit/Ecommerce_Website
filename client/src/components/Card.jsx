import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify"; // ✅ Import toast

const Card = ({ product }) => {
  const { addToEcoCart } = useContext(AppContext);

  const getBadgeColor = (score) => {
    if (["A+", "A"].includes(score)) return "bg-green-100 text-green-700";
    if (score === "B" || score === "C") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-700";
  };

  const handleAddToCart = () => {
    addToEcoCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <img
        src={product.coverImage || "https://picsum.photos/300/200"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          ♻️ Materials: {product.materials.join(", ")}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          🌍 CO₂ Footprint: {product.carbonFootprint} kg
        </p>
        <p className="text-sm text-gray-700 font-medium mb-1">
          💰 Price: ${product.price?.toFixed(2) || "0.00"}
        </p>
        <span
          className={`inline-block mt-2 text-sm font-bold px-3 py-1 rounded-full ${getBadgeColor(
            product.ecoScore
          )}`}
        >
          EcoScore: {product.ecoScore}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Add to Eco Cart
      </button>
    </div>
  );
};

export default Card;
