const express = require('express');
const { body } = require('express-validator');
const {
  getAssignedPickups,
  acceptPickup,
  updateCollectionStatus,
  getCollectorStats,
  getAvailablePickups,
  selfAssignPickup,
} = require('../controllers/collector.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require collector role
router.use(protect, authorize('collector'));

// @route   GET /api/collector/available - Browse pending/unassigned pickups
router.get('/available', getAvailablePickups);

// @route   GET /api/collector/assigned
router.get('/assigned', getAssignedPickups);

// @route   GET /api/collector/stats
router.get('/stats', getCollectorStats);

// @route   PUT /api/collector/:id/self-assign - Collector claims a pending pickup
router.put('/:id/self-assign', selfAssignPickup);

// @route   PUT /api/collector/:id/accept
router.put('/:id/accept', acceptPickup);

// @route   PUT /api/collector/:id/update-status
router.put(
  '/:id/update-status',
  [body('status').notEmpty().withMessage('Status is required')],
  validate,
  updateCollectionStatus
);

module.exports = router;
