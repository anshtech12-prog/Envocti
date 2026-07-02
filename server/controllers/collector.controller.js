const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Get pickups assigned to the current collector
 * @route   GET /api/collector/assigned
 * @access  Private (Collector)
 */
const getAssignedPickups = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { collector: req.user._id };
    if (status) filter.status = status;

    const total = await PickupRequest.countDocuments(filter);
    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email phone address')
      .sort({ pickupDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: pickups,
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
 * @desc    Accept a pickup assignment
 * @route   PUT /api/collector/:id/accept
 * @access  Private (Collector)
 */
const acceptPickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Verify this pickup is assigned to the current collector
    if (pickup.collector?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This pickup is not assigned to you',
      });
    }

    pickup.status = 'in-progress';
    pickup.statusHistory.push({
      status: 'in-progress',
      timestamp: new Date(),
      note: 'Collector accepted and started pickup',
    });
    await pickup.save();

    // Notify user
    await Notification.create({
      user: pickup.user,
      title: 'Pickup In Progress',
      message: 'Your collector has accepted and is on the way!',
      type: 'pickup_update',
      relatedPickup: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup accepted',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update collection status (collector workflow)
 * @route   PUT /api/collector/:id/update-status
 * @access  Private (Collector)
 */
const updateCollectionStatus = async (req, res, next) => {
  try {
    const { status, note, estimatedWeight } = req.body;

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Verify this pickup is assigned to the current collector
    if (pickup.collector?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This pickup is not assigned to you',
      });
    }

    // Collectors can update to: in-progress, collected, recycled, completed
    const allowedStatuses = ['in-progress', 'collected', 'recycled', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Collectors can only update status to: ${allowedStatuses.join(', ')}`,
      });
    }

    pickup.status = status;
    if (estimatedWeight) pickup.estimatedWeight = estimatedWeight;
    pickup.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });
    await pickup.save();

    // If completed, award reward points to the user
    if (status === 'completed') {
      const { CATEGORY_POINTS } = require('../utils/constants');
      const points = (CATEGORY_POINTS[pickup.category] || 40) * pickup.quantity;
      pickup.rewardPoints = points;
      await pickup.save();

      // Update user's green score and total pickups
      await User.findByIdAndUpdate(pickup.user, {
        $inc: { greenScore: points, totalPickups: 1 },
      });

      // Create reward record
      const Reward = require('../models/Reward');
      await Reward.create({
        user: pickup.user,
        pickup: pickup._id,
        points,
        type: 'pickup_completed',
        description: `Earned ${points} points for recycling ${pickup.quantity} ${pickup.category}(s)`,
      });

      // Notify user about reward
      await Notification.create({
        user: pickup.user,
        title: 'Pickup Completed! 🎉',
        message: `Your pickup has been completed! You earned ${points} green points.`,
        type: 'reward',
        relatedPickup: pickup._id,
      });
    } else {
      // Notify user about status update
      await Notification.create({
        user: pickup.user,
        title: 'Pickup Status Updated',
        message: `Your pickup status has been updated to "${status}".`,
        type: 'pickup_update',
        relatedPickup: pickup._id,
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get collector statistics
 * @route   GET /api/collector/stats
 * @access  Private (Collector)
 */
const getCollectorStats = async (req, res, next) => {
  try {
    const collectorId = req.user._id;

    const totalAssigned = await PickupRequest.countDocuments({ collector: collectorId });
    const completed = await PickupRequest.countDocuments({ collector: collectorId, status: 'completed' });
    const inProgress = await PickupRequest.countDocuments({
      collector: collectorId,
      status: { $in: ['in-progress', 'collected', 'recycled'] },
    });
    const pending = await PickupRequest.countDocuments({ collector: collectorId, status: 'assigned' });

    // Today's collections
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCompleted = await PickupRequest.countDocuments({
      collector: collectorId,
      status: { $in: ['collected', 'recycled', 'completed'] },
      updatedAt: { $gte: today },
    });

    // Total weight collected
    const weightAgg = await PickupRequest.aggregate([
      { $match: { collector: collectorId, status: 'completed' } },
      { $group: { _id: null, totalWeight: { $sum: '$estimatedWeight' } } },
    ]);
    const totalWeight = weightAgg.length > 0 ? weightAgg[0].totalWeight : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAssigned,
        completed,
        inProgress,
        pending,
        todayCompleted,
        totalWeight,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending (unassigned) pickup requests so collectors can see them
 * @route   GET /api/collector/available
 * @access  Private (Collector)
 */
const getAvailablePickups = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const filter = { status: 'pending', collector: null };
    if (category) filter.category = category;

    const total = await PickupRequest.countDocuments(filter);
    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: pickups,
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
 * @desc    Collector self-assigns a pending pickup request
 * @route   PUT /api/collector/:id/self-assign
 * @access  Private (Collector)
 */
const selfAssignPickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Only pending & unassigned pickups can be self-assigned
    if (pickup.status !== 'pending' || pickup.collector) {
      return res.status(400).json({
        success: false,
        message: 'This pickup request has already been assigned to a collector',
      });
    }

    pickup.collector = req.user._id;
    pickup.status = 'assigned';
    pickup.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Self-assigned by collector: ${req.user.name}`,
    });

    await pickup.save();

    // Notify the user that a collector picked up their request
    await Notification.create({
      user: pickup.user,
      title: 'Collector Assigned',
      message: `A collector (${req.user.name}) has accepted your pickup request.`,
      type: 'pickup_update',
      relatedPickup: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup request assigned to you successfully',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedPickups,
  acceptPickup,
  updateCollectionStatus,
  getCollectorStats,
  getAvailablePickups,
  selfAssignPickup,
};
