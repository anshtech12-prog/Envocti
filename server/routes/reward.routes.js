const express = require('express');
const { getMyRewards, getLeaderboard } = require('../controllers/reward.controller');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rewards/leaderboard (Public)
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/rewards/my-rewards (Private)
router.get('/my-rewards', protect, getMyRewards);

module.exports = router;
