const mongoose = require('mongoose');

/**
 * Reward Schema
 * Tracks points earned by users for completed pickups and other activities
 */
const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null,
    },
    points: {
      type: Number,
      required: [true, 'Points value is required'],
      min: [0, 'Points cannot be negative'],
    },
    type: {
      type: String,
      enum: ['pickup_completed', 'bonus', 'referral'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user reward queries
rewardSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Reward', rewardSchema);
