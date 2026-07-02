const mongoose = require('mongoose');

/**
 * Notification Schema
 * In-app notifications for users about pickup updates, assignments, rewards, etc.
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    type: {
      type: String,
      enum: ['pickup_update', 'assignment', 'reward', 'system'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedPickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient notification fetching
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
