const express = require('express');
const { body } = require('express-validator');
const {
  createPickup,
  getMyPickups,
  getPickupById,
  getAllPickups,
  updatePickupStatus,
  assignPickup,
  deletePickup,
} = require('../controllers/pickup.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/pickups - Create pickup request (User)
router.post(
  '/',
  protect,
  authorize('user'),
  upload.array('images', 5),
  (req, res, next) => {
    // If the request is multipart/form-data, flat keys like address[street] need to be parsed
    if (req.body && !req.body.address && req.body['address[street]'] !== undefined) {
      req.body.address = {
        street: req.body['address[street]'],
        city: req.body['address[city]'],
        state: req.body['address[state]'],
        pincode: req.body['address[pincode]'],
      };
    }
    next();
  },
  [
    body('category')
      .isIn(['mobile', 'laptop', 'battery', 'charger', 'tv', 'other'])
      .withMessage('Invalid waste category'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').notEmpty().withMessage('Pincode is required'),
    body('pickupDate').isISO8601().withMessage('Valid pickup date is required'),
    body('pickupTime').notEmpty().withMessage('Pickup time is required'),
  ],
  validate,
  createPickup
);

// @route   GET /api/pickups/my-pickups - Get user's pickups
router.get('/my-pickups', protect, authorize('user'), getMyPickups);

// @route   GET /api/pickups/:id - Get single pickup
router.get('/:id', protect, getPickupById);

// @route   GET /api/pickups - Get all pickups (Admin)
router.get('/', protect, authorize('admin'), getAllPickups);

// @route   PUT /api/pickups/:id/status - Update status (Collector/Admin)
router.put(
  '/:id/status',
  protect,
  authorize('collector', 'admin'),
  [body('status').notEmpty().withMessage('Status is required')],
  validate,
  updatePickupStatus
);

// @route   PUT /api/pickups/:id/assign - Assign to collector (Admin)
router.put(
  '/:id/assign',
  protect,
  authorize('admin'),
  [body('collectorId').notEmpty().withMessage('Collector ID is required')],
  validate,
  assignPickup
);

// @route   DELETE /api/pickups/:id - Cancel pickup (User/Admin)
router.delete('/:id', protect, authorize('user', 'admin'), deletePickup);

module.exports = router;
