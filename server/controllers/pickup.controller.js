const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');
const { CATEGORY_POINTS } = require('../utils/constants');

/**
 * @desc    Create a new pickup request
 * @route   POST /api/pickups
 * @access  Private (User)
 */
const createPickup = async (req, res, next) => {
  try {
    const {
      category,
      quantity,
      description,
      address,
      pickupDate,
      pickupTime,
      estimatedWeight,
    } = req.body;

    // Handle uploaded images
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const pickup = await PickupRequest.create({
      user: req.user._id,
      category,
      quantity,
      description,
      images,
      address,
      pickupDate,
      pickupTime,
      estimatedWeight: estimatedWeight || 0,
    });

    // Create notification for user
    await Notification.create({
      user: req.user._id,
      title: 'Pickup Request Created',
      message: `Your pickup request for ${quantity} ${category}(s) has been submitted successfully.`,
      type: 'pickup_update',
      relatedPickup: pickup._id,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's pickup requests
 * @route   GET /api/pickups/my-pickups
 * @access  Private (User)
 */
const getMyPickups = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await PickupRequest.countDocuments(filter);
    const pickups = await PickupRequest.find(filter)
      .populate('collector', 'name phone email')
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
 * @desc    Get single pickup request by ID
 * @route   GET /api/pickups/:id
 * @access  Private
 */
const getPickupById = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('collector', 'name email phone');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Users can only view their own pickups (unless admin/collector)
    if (
      req.user.role === 'user' &&
      pickup.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pickup request',
      });
    }

    res.status(200).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pickup requests (with filters)
 * @route   GET /api/pickups
 * @access  Private (Admin)
 */
const getAllPickups = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await PickupRequest.countDocuments(filter);
    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email phone')
      .populate('collector', 'name email phone')
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
 * @desc    Update pickup status
 * @route   PUT /api/pickups/:id/status
 * @access  Private (Collector/Admin)
 */
const updatePickupStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Update status
    pickup.status = status;
    pickup.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    // If completed, award reward points
    if (status === 'completed') {
      const points = (CATEGORY_POINTS[pickup.category] || 40) * pickup.quantity;
      pickup.rewardPoints = points;

      // Update user's green score and total pickups
      await User.findByIdAndUpdate(pickup.user, {
        $inc: { greenScore: points, totalPickups: 1 },
      });

      // Create reward record
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
        message: `Your pickup request status has been updated to "${status}".`,
        type: 'pickup_update',
        relatedPickup: pickup._id,
      });
    }

    await pickup.save();

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
 * @desc    Assign pickup to a collector
 * @route   PUT /api/pickups/:id/assign
 * @access  Private (Admin)
 */
const assignPickup = async (req, res, next) => {
  try {
    const { collectorId } = req.body;

    // Verify collector exists and has collector role
    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'collector') {
      return res.status(400).json({
        success: false,
        message: 'Invalid collector',
      });
    }

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    pickup.collector = collectorId;
    pickup.status = 'assigned';
    pickup.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Assigned to collector: ${collector.name}`,
    });

    await pickup.save();

    // Notify collector about assignment
    await Notification.create({
      user: collectorId,
      title: 'New Pickup Assigned',
      message: `A new pickup request has been assigned to you. Category: ${pickup.category}, Quantity: ${pickup.quantity}`,
      type: 'assignment',
      relatedPickup: pickup._id,
    });

    // Notify user about assignment
    await Notification.create({
      user: pickup.user,
      title: 'Collector Assigned',
      message: `A collector (${collector.name}) has been assigned to your pickup request.`,
      type: 'pickup_update',
      relatedPickup: pickup._id,
    });

    res.status(200).json({
      success: true,
      message: 'Pickup assigned to collector',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel/Delete pickup request
 * @route   DELETE /api/pickups/:id
 * @access  Private (User/Admin)
 */
const deletePickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    // Only allow deletion of pending pickups (unless admin)
    if (req.user.role !== 'admin' && pickup.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending pickup requests',
      });
    }

    // Verify ownership for non-admin users
    if (
      req.user.role === 'user' &&
      pickup.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this pickup',
      });
    }

    await PickupRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pickup request cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPickup,
  getMyPickups,
  getPickupById,
  getAllPickups,
  updatePickupStatus,
  assignPickup,
  deletePickup,
};
