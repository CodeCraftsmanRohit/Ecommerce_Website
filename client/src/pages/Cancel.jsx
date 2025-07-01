// src/pages/Cancel.jsx
import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Payment Canceled</h1>
      <p className="text-lg text-gray-700 mb-6">
        You canceled the checkout. You can try again anytime.
      </p>
      <Link
        to="/cart"
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default Cancel;
