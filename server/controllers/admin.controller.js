const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
const getDashboard = async (req, res, next) => {
  try {
    // User counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });

    // Pickup counts
    const totalRequests = await PickupRequest.countDocuments();
    const pendingRequests = await PickupRequest.countDocuments({ status: 'pending' });
    const assignedRequests = await PickupRequest.countDocuments({ status: 'assigned' });
    const inProgressRequests = await PickupRequest.countDocuments({ status: 'in-progress' });
    const completedRequests = await PickupRequest.countDocuments({ status: 'completed' });

    // Total weight collected
    const weightAgg = await PickupRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalWeight: { $sum: '$estimatedWeight' } } },
    ]);
    const totalWeight = weightAgg.length > 0 ? weightAgg[0].totalWeight : 0;

    // Category-wise statistics
    const categoryStats = await PickupRequest.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly collection trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrends = await PickupRequest.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          weight: { $sum: '$estimatedWeight' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Status distribution
    const statusDistribution = await PickupRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent requests
    const recentRequests = await PickupRequest.find()
      .populate('user', 'name email')
      .populate('collector', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCollectors,
          activeUsers,
          totalRequests,
          pendingRequests,
          assignedRequests,
          inProgressRequests,
          completedRequests,
          totalWeight,
        },
        categoryStats,
        monthlyTrends,
        statusDistribution,
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: users,
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
 * @desc    Get all collectors
 * @route   GET /api/admin/collectors
 * @access  Private (Admin)
 */
const getCollectors = async (req, res, next) => {
  try {
    const collectors = await User.find({ role: 'collector' }).sort({ createdAt: -1 });

    // Get pickup stats for each collector
    const collectorsWithStats = await Promise.all(
      collectors.map(async (collector) => {
        const assignedCount = await PickupRequest.countDocuments({ collector: collector._id });
        const completedCount = await PickupRequest.countDocuments({
          collector: collector._id,
          status: 'completed',
        });
        return {
          ...collector.toObject(),
          assignedCount,
          completedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: collectorsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user (admin action)
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, isActive, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create collector account
 * @route   POST /api/admin/collectors
 * @access  Private (Admin)
 */
const createCollector = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const collector = await User.create({
      name,
      email,
      password,
      phone,
      role: 'collector',
      address: address || {},
    });

    res.status(201).json({
      success: true,
      message: 'Collector account created successfully',
      data: {
        _id: collector._id,
        name: collector.name,
        email: collector.email,
        phone: collector.phone,
        role: collector.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate reports
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
const getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (startDate || endDate) matchStage.createdAt = dateFilter;

    // Overall summary
    const summary = await PickupRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalWeight: { $sum: '$estimatedWeight' },
          totalRewardPoints: { $sum: '$rewardPoints' },
          avgQuantity: { $avg: '$quantity' },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await PickupRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalWeight: { $sum: '$estimatedWeight' },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Status breakdown
    const statusBreakdown = await PickupRequest.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Top recyclers
    const topRecyclers = await PickupRequest.aggregate([
      { $match: { ...matchStage, status: 'completed' } },
      { $group: { _id: '$user', pickups: { $sum: 1 }, totalWeight: { $sum: '$estimatedWeight' } } },
      { $sort: { pickups: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name: '$userInfo.name',
          email: '$userInfo.email',
          pickups: 1,
          totalWeight: 1,
          greenScore: '$userInfo.greenScore',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || { totalRequests: 0, totalWeight: 0, totalRewardPoints: 0, avgQuantity: 0 },
        categoryBreakdown,
        statusBreakdown,
        topRecyclers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Impersonate a user/collector (Admin only)
 * @route   POST /api/admin/users/:id/impersonate
 * @access  Private (Admin)
 */
const impersonateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const generateToken = require('../utils/generateToken');
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Impersonated user ${user.name} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        greenScore: user.greenScore,
        totalPickups: user.totalPickups,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getCollectors,
  updateUser,
  deactivateUser,
  createCollector,
  getReports,
  impersonateUser,
};
