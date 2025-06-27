import userModel from "../models/usermodel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        coverImage: user.coverImage,
        ecoStats: user.ecoStats,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const users = await userModel
      .find({}, 'name ecoStats.totalCO2Saved rewards coverImage')
      .sort({ 'ecoStats.totalCO2Saved': -1 })
      .limit(10);

    res.json({ success: true, leaderboard: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Leaderboard fetch failed" });
  }
};
