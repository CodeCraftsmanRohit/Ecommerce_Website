import React from "react";

const ProductDetails = ({ product }) => {
  if (!product) {
    return <div className="text-center mt-10">Loading product details...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-green-600 font-semibold mb-2">EcoScore: {product.ecoScore}</p>
      <p><strong>Materials:</strong> {product.materials?.join(", ")}</p>
      <p><strong>Recyclable:</strong> {product.recyclable ? "Yes ♻️" : "No"}</p>
      <p><strong>Carbon Footprint:</strong> {product.carbonFootprint} kg CO₂</p>
      <p><strong>Tips:</strong> {product.recyclingTips}</p>
    </div>
  );
};

export default ProductDetails;
