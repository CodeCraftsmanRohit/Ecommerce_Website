import React, { useContext, useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
import { toast } from "react-toastify";
import ProductDetails from "./ProductDetails";
import { AppContext } from "../context/AppContext";

const BarcodeScanner = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [scanproduct, setscanProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    console.log("🔄 scanproduct updated:", scanproduct);
    if (scanproduct) {
      setIsLoading(false); // Reset loading when product is set
    }
  }, [scanproduct]);

  console.log("🔗 Backend URL:", backendUrl);

  const handleDetected = async (result) => {
    if (!data && result?.text) {
      console.log("🟢 Scanned barcode:", result.text);
      setData(result.text);
      setIsLoading(true); // Set loading state
      try {
        const res = await axios.get(`${backendUrl}/api/products/${result.text}`, {
          withCredentials: true,
        });
        console.log("📦 Full API response:", res);
        console.log("📦 Product data:", res.data);
        setscanProduct(res.data);

        if (userData) {
          await axios.post(
            `${backendUrl}/api/products/track-scan`,
            { productId: res.data._id },
            { withCredentials: true }
          );
          console.log("✅ Scan tracked");
        }
        toast.success("Product scanned successfully!");
      } catch (error) {
        console.error("❌ API Error:", {
          message: error.message,
          response: error.response ? error.response.data : "No response",
          status: error.response ? error.response.status : "No status",
        });
        toast.error(`Product not found: ${error.message}`);
        setscanProduct(null); // Reset on error
        setIsLoading(false);
      }
    }
  };

  const resetScan = () => {
    setData(null);
    setscanProduct(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="text-center mt-10">
          Loading product details...
        </div>
      ) : !scanproduct ? (
        <>
          <h2 className="text-xl font-bold mb-4">Scan a Barcode</h2>
          {error && (
            <p className="text-red-500 mb-4">
              Camera error: {error.message}. Please allow camera access.
            </p>
          )}
          <BarcodeScannerComponent
            width="100%"
            height={window.innerHeight * 0.4}
            onUpdate={(err, result) => {
              if (err) {
                console.error("❌ Camera error:", err);
                setError(err);
              }
              if (result?.text && !data && !scanproduct) {
                handleDetected(result);
              }
            }}
          />
        </>
      ) : (
        <div>
          <ProductDetails product={scanproduct} />
          <button
            onClick={resetScan}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Scan Another Barcode
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;