const Reward = require('../models/Reward');
const User = require('../models/User');

/**
 * @desc    Get current user's reward history
 * @route   GET /api/rewards/my-rewards
 * @access  Private (User)
 */
const getMyRewards = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Reward.countDocuments({ user: req.user._id });
    const rewards = await Reward.find({ user: req.user._id })
      .populate('pickup', 'category quantity status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate totals
    const totalPoints = await Reward.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        rewards,
        totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
        greenScore: req.user.greenScore,
      },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leaderboard (top recyclers)
 * @route   GET /api/rewards/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ role: 'user', greenScore: { $gt: 0 } })
      .select('name greenScore totalPickups avatar')
      .sort({ greenScore: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: topUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRewards,
  getLeaderboard,
};
