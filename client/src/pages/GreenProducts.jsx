import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import Card from "../components/Card.jsx";

const GreenProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [ecoOnly, setEcoOnly] = useState(true);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/products/view`)
      .then((res) => {
        console.log("All products from backend:", res.data);
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);

  const toggleTab = (eco) => setEcoOnly(eco);

  const filteredProducts = ecoOnly
    ? allProducts.filter((p) => ["A+", "A", "B"].includes(p.ecoScore))
    : allProducts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        🌱 Eco Products
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => toggleTab(false)}
          className={`px-4 py-2 rounded-full font-semibold ${
            !ecoOnly ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => toggleTab(true)}
          className={`px-4 py-2 rounded-full font-semibold ${
            ecoOnly ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Eco Only
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GreenProducts;
