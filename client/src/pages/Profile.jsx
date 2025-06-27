import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import CarbonTracker from "../components/CarbonTracker";
import Leaderboard from "../components/Leaderboard";

const Profile = () => {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return (
      <div className="text-center text-gray-600 py-10">Loading profile...</div>
    );
  }

  const { name, email, coverImage, profileImage = coverImage } = userData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cover / Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-green-400 to-blue-400 rounded-xl overflow-hidden relative shadow-md">
        {coverImage?.trim() !== "" && (
          <img className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-6 py-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg tracking-wide">
            👋 Welcome, {" "}
            <span className="underline decoration-wavy decoration-green-300">
              {name}
            </span>
            !
          </h1>
        </div>
      </div>

      {/* Profile & Info */}
      <div className="bg-white mt-6 rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400 shadow-md">
          <img
            src={userData.profileImage || profileImage}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h2 className="text-lg font-semibold text-green-600 uppercase tracking-wide">
            Personal Details
          </h2>

          <div className="text-gray-800">
            <p className="text-xl font-bold">{name}</p>
            <p className="text-gray-600 text-sm md:text-base">📧 {email}</p>
          </div>
        </div>
      </div>

      {/* Eco Stats */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-green-600 uppercase tracking-wide mb-4">
          Eco Scorecard
        </h2>
        <CarbonTracker />
      </div>





      {/* Leaderboard */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-green-600 uppercase tracking-wide mb-4">
          🏆 Leaderboard
        </h2>
        <Leaderboard />
      </div>
    </div>
  );
};

export default Profile;
