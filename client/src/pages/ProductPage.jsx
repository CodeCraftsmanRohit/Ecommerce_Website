// pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductDetails from "../components/ProductDetails";

const ProductPage = () => {
  const { barcode } = useParams();
  const [scannedProduct, setScannedProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${barcode}`);
        setScannedProduct(res.data);
      } catch (err) {
        console.error("❌ Failed to load product:", err.message);
      }
    };

    fetchProduct();
  }, [barcode]);

  return (
    <div className="p-4">
      {scannedProduct ? (
        <ProductDetails product={scannedProduct} />
      ) : (
        <div className="text-center">Loading product details...</div>
      )}
    </div>
  );
};

export default ProductPage;
