import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/leaderboard`)
      .then(res => {
        if (res.data.success) setLeaders(res.data.leaderboard);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">🌍 Eco Leaderboard</h2>
      <ul className="space-y-3">
        {leaders.map((user, idx) => (
          <li key={idx} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg shadow">
            <span className="text-lg font-bold w-6">{idx + 1}</span>
            <img src={user.coverImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">CO₂ Saved: {user.ecoStats.totalCO2Saved.toFixed(2)} kg</p>
              <p className="text-sm text-purple-500">🎁 Rewards: {user.rewards}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
