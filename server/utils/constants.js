/**
 * Application-wide constants
 */

// User roles
const ROLES = {
  USER: 'user',
  COLLECTOR: 'collector',
  ADMIN: 'admin',
};

// E-waste categories
const WASTE_CATEGORIES = [
  'mobile',
  'laptop',
  'battery',
  'charger',
  'tv',
  'other',
];

// Pickup request statuses (in lifecycle order)
const PICKUP_STATUSES = [
  'pending',
  'assigned',
  'in-progress',
  'collected',
  'recycled',
  'completed',
];

// Reward types
const REWARD_TYPES = ['pickup_completed', 'bonus', 'referral'];

// Notification types
const NOTIFICATION_TYPES = ['pickup_update', 'assignment', 'reward', 'system'];

// Points awarded per category (base points)
const CATEGORY_POINTS = {
  mobile: 50,
  laptop: 100,
  battery: 30,
  charger: 20,
  tv: 150,
  other: 40,
};

// Status display labels
const STATUS_LABELS = {
  'pending': 'Pending',
  'assigned': 'Assigned',
  'in-progress': 'In Progress',
  'collected': 'Collected',
  'recycled': 'Recycled',
  'completed': 'Completed',
};

module.exports = {
  ROLES,
  WASTE_CATEGORIES,
  PICKUP_STATUSES,
  REWARD_TYPES,
  NOTIFICATION_TYPES,
  CATEGORY_POINTS,
  STATUS_LABELS,
};
