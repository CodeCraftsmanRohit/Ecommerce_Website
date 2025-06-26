import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import wallpaper from "../assets/wallpaper.jpg";
import { AppContext } from "../context/AppContext";


const Hero = () => {
    const { userData,isLoggedin } = useContext(AppContext);
let stats = {
    totalCO2Saved: 0,
    totalItemsScanned: 0,
    ecoRank: "Beginner",
  };

  if (isLoggedin && userData?.ecoStats) {
    stats = userData.ecoStats;
  }

  const navigate = useNavigate(); // ✅ Hook used inside component

  return(
    <div className="w-full bg-gradient-to-b from-green-100 to-blue-50 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6 px-4">
        {/* Hero Image */}
        <div className="relative h-[28rem] w-full md:w-2/3 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={wallpaper}
            alt="EcoChoice Background"
            className="absolute w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10 rounded-2xl"></div>

          <div className="relative z-20 p-8 text-white flex flex-col justify-end h-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make Smarter, Greener Choices Every Time You Shop 🌱
            </h1>
            <p className="text-lg md:text-xl mb-6">
              EcoScore every item. Track your carbon impact. Earn rewards.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button  onClick={() => navigate("/green-products")} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition">
                Browse Eco Products
              </button>
              <button
                onClick={() => navigate("/scan")}
                className="bg-white hover:bg-gray-100 text-green-700 border border-green-600 px-6 py-3 rounded-full font-semibold transition"
              >
                📷 Scan Barcode to Begin
              </button>
            </div>
          </div>
        </div>

        {/* Optional Side Highlight */}
        <div className="hidden md:flex flex-col gap-4 w-1/3">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">This Month’s CO₂ Saved</p>
            <p className="text-2xl font-bold text-green-600">{stats?.totalCO2Saved?.toFixed(2)} Kg</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Eco Rank</p>
            <p className="text-2xl font-bold text-green-600">{stats?.ecoRank} 🌿</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Total Items Scanned</p>
            <p className="text-2xl font-bold text-green-600">{stats?.totalItemsScanned}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
