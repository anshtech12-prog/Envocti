const express = require('express');
const { body } = require('express-validator');
const {
  getDashboard,
  getUsers,
  getCollectors,
  updateUser,
  deactivateUser,
  createCollector,
  getReports,
  impersonateUser,
} = require('../controllers/admin.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// @route   GET /api/admin/users
router.get('/users', getUsers);

// @route   GET /api/admin/collectors
router.get('/collectors', getCollectors);

// @route   PUT /api/admin/users/:id
router.put('/users/:id', updateUser);

// @route   POST /api/admin/users/:id/impersonate
router.post('/users/:id/impersonate', impersonateUser);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', deactivateUser);

// @route   POST /api/admin/collectors
router.post(
  '/collectors',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone')
      .matches(/^[0-9]{10}$/)
      .withMessage('Valid 10-digit phone number required'),
  ],
  validate,
  createCollector
);

// @route   GET /api/admin/reports
router.get('/reports', getReports);

module.exports = router;
