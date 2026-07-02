const mongoose = require('mongoose');

/**
 * Pickup Request Schema
 * Tracks the full lifecycle of an e-waste pickup request
 * Status flow: pending → assigned → in-progress → collected → recycled → completed
 */
const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      enum: ['mobile', 'laptop', 'battery', 'charger', 'tv', 'other'],
      required: [true, 'Waste category is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    images: [
      {
        type: String, // File paths to uploaded images
      },
    ],
    address: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      pincode: { type: String, required: [true, 'Pincode is required'] },
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time slot is required'],
      enum: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'],
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'collected', 'recycled', 'completed'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'assigned', 'in-progress', 'collected', 'recycled', 'completed'],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    estimatedWeight: {
      type: Number,
      default: 0, // in kg
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add initial status to history on creation
pickupRequestSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: 'Pickup request created',
    });
  }
  next();
});

// Index for efficient queries
pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
