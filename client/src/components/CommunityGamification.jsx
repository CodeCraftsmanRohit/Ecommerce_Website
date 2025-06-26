import React from "react";
import {
  Flame,
  Medal,
  Users,
  TreePine,
  Leaf,
  Globe,
  RefreshCw,
  Zap,
} from "lucide-react";

// Sample Data
const leaderboard = [
  { name: "Aarav", region: "India", type: "Customer", score: "15.6kg", medal: "🥇" },
  { name: "Maya", region: "India", type: "Customer", score: "13.9kg", medal: "🥈" },
  { name: "Rahul", region: "India", type: "Supplier", score: "11.2kg", medal: "🥉" },
];

const badges = [
  { label: "10 Products Recycled", icon: <RefreshCw className="w-5 h-5" /> },
  { label: "Eco Warrior", icon: <TreePine className="w-5 h-5" /> },
  { label: "CO₂ Saver", icon: <Leaf className="w-5 h-5" /> },
  { label: "Global Impact", icon: <Globe className="w-5 h-5" /> },
];

const CommunityGamification = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-[Nunito]">
      {/* Monthly Challenge */}
      <div className="bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">🎯 Monthly Challenge</h2>
            <p className="text-lg">Recycle 10 products — win ₹500 voucher</p>
          </div>
          <button className="bg-white text-[#0984e3] px-4 py-2 rounded-full font-semibold hover:bg-gray-100">
            Join Now
          </button>
        </div>
        <div className="absolute top-2 right-3 text-yellow-300 animate-ping">
          <Zap size={32} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🏆 Leaderboard
        </h2>
        <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 mb-2">
          <p>👤 Name</p>
          <p>🌍 Region</p>
          <p>🎯 Type</p>
          <p>💨 CO₂ Saved</p>
        </div>
        {leaderboard.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 py-2 border-b text-gray-800"
          >
            <p>
              {user.medal} {user.name}
            </p>
            <p>{user.region}</p>
            <p>{user.type}</p>
            <p>{user.score}</p>
          </div>
        ))}
        {/* Add filter inputs if needed later */}
      </div>

      {/* Badges & Rewards Carousel */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🧩 Badges & Rewards
        </h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="min-w-[180px] bg-green-100 border border-green-300 p-4 rounded-lg flex flex-col items-center justify-center text-green-800 shadow hover:scale-105 transition"
            >
              {badge.icon}
              <p className="mt-2 font-medium text-center">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Stats / Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            🔥 Streak Progress
          </h3>
          <div className="text-orange-500 font-bold text-lg flex items-center gap-1">
            <Flame className="w-5 h-5" />
            Day 4 — Keep it up!
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
            <div className="bg-orange-500 h-2 rounded-full w-[40%]"></div>
          </div>
        </div>

        {/* Progress Bar Example */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            📦 Challenge Progress
          </h3>
          <p className="text-sm mb-1 text-gray-500">6 of 10 items recycled</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-blue-500 h-2 rounded-full w-[60%]"></div>
          </div>
        </div>

        {/* Confetti Note */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            🎉 Milestone Unlocked!
          </h3>
          <p className="text-sm text-green-700">
            Congrats! You unlocked your first eco badge.
          </p>
          <p className="text-xs text-gray-400 mt-1 italic">
            (Confetti animation trigger here 🚀)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGamification;
