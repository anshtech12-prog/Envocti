const express = require('express');
const { getUserDashboard } = require('../controllers/user.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

// @route   GET /api/users/dashboard - Get user dashboard stats
router.get('/dashboard', protect, authorize('user'), getUserDashboard);

module.exports = router;
