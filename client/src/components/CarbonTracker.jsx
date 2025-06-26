import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const CarbonTracker = () => {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return <div className="text-center py-4">Loading eco stats...</div>;
  }

  const stats = userData.ecoStats || {
    totalCO2Saved: 0,
    totalItemsScanned: 0,
    ecoRank: "Beginner",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">CO₂ Saved</p>
        <p className="text-2xl font-bold text-green-700">
          {stats.totalCO2Saved.toFixed(2)} kg
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">Items Scanned</p>
        <p className="text-2xl font-bold text-blue-700">
          {stats.totalItemsScanned}
        </p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg shadow-sm text-center">
        <p className="text-sm text-gray-500">Eco Rank</p>
        <p className="text-2xl font-bold text-yellow-600">
          {stats.ecoRank} 🌿
        </p>
      </div>
    </div>
  );
};

export default CarbonTracker;
