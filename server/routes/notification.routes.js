const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notification.controller');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/notifications
router.get('/', getNotifications);

// @route   PUT /api/notifications/read-all
router.put('/read-all', markAllAsRead);

// @route   PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

module.exports = router;
