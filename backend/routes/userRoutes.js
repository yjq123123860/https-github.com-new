const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('realName', 'Real name is required').not().isEmpty(),
  check('studentId', 'Student ID is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('school', 'School is required').not().isEmpty(),
], userController.register);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists(),
], userController.login);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, userController.updateProfile);

// @route   POST api/users/refresh
// @desc    Refresh token
// @access  Private
router.post('/refresh', auth, userController.refreshToken);

module.exports = router;