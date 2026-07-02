const User = require('../models/User');
const Reward = require('../models/Reward');
const PickupRequest = require('../models/PickupRequest');

/**
 * @desc    Get user dashboard stats
 * @route   GET /api/users/dashboard
 * @access  Private (User)
 */
const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get pickup stats
    const totalPickups = await PickupRequest.countDocuments({ user: userId });
    const pendingPickups = await PickupRequest.countDocuments({ user: userId, status: 'pending' });
    const completedPickups = await PickupRequest.countDocuments({ user: userId, status: 'completed' });
    const inProgressPickups = await PickupRequest.countDocuments({
      user: userId,
      status: { $in: ['assigned', 'in-progress', 'collected', 'recycled'] },
    });

    // Get recent pickups
    const recentPickups = await PickupRequest.find({ user: userId })
      .populate('collector', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total reward points
    const rewardAgg = await Reward.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalPoints: { $sum: '$points' } } },
    ]);
    const totalPoints = rewardAgg.length > 0 ? rewardAgg[0].totalPoints : 0;

    // Calculate estimated environmental impact
    const completedRequests = await PickupRequest.find({
      user: userId,
      status: 'completed',
    });
    const totalWeight = completedRequests.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
    const co2Saved = (totalWeight * 2.5).toFixed(1); // Rough estimate: 2.5kg CO2 per kg e-waste

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPickups,
          pendingPickups,
          completedPickups,
          inProgressPickups,
          greenScore: req.user.greenScore,
          totalPoints,
          totalWeight,
          co2Saved,
        },
        recentPickups,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserDashboard,
};
