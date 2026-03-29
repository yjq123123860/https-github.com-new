const { users } = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, realName, studentId, phone, school } = req.body;

  try {
    // Check if user exists
    let user = users.find(u => u.username === username);
    if (user) {
      logger.info('User registration failed: user already exists', { username });
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      realName,
      studentId,
      phone,
      school,
      role: 'user',
      createdAt: new Date(),
    };

    users.push(newUser);

    logger.info('User registered successfully', { userId: newUser.id, username: newUser.username });

    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (err, token) => {
      if (err) {
        logger.error('Error generating token', { error: err.message });
        throw err;
      }
      res.json({ token, user: {
        id: newUser.id,
        username: newUser.username,
        realName: newUser.realName,
        studentId: newUser.studentId,
        phone: newUser.phone,
        school: newUser.school,
        role: newUser.role,
      }});
    });
  } catch (error) {
    logger.error('Error registering user', { error: error.message });
    res.status(500).send('Server error');
  }
};

// @route   POST api/users/login
// @desc    Login user
// @access  Public
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = users.find(u => u.username === username);
    if (!user) {
      logger.info('Login failed: user not found', { username });
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info('Login failed: invalid password', { username });
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    logger.info('User logged in successfully', { userId: user.id, username: user.username });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (err, token) => {
      if (err) {
        logger.error('Error generating token', { error: err.message });
        throw err;
      }
      res.json({ token, user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        studentId: user.studentId,
        phone: user.phone,
        school: user.school,
        role: user.role,
      }});
    });
  } catch (error) {
    logger.error('Error logging in user', { error: error.message });
    res.status(500).send('Server error');
  }
};

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    logger.error('Error getting user profile', { error: error.message });
    res.status(500).send('Server error');
  }
};

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
  const { realName, studentId, phone, school } = req.body;

  try {
    let user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.realName = realName || user.realName;
    user.studentId = studentId || user.studentId;
    user.phone = phone || user.phone;
    user.school = school || user.school;

    res.json(user);
  } catch (error) {
    logger.error('Error updating user profile', { error: error.message });
    res.status(500).send('Server error');
  }
};

// @route   POST api/users/refresh
// @desc    Refresh token
// @access  Private
const refreshToken = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (err, token) => {
      if (err) {
        logger.error('Error generating token', { error: err.message });
        throw err;
      }
      res.json({ token, user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        studentId: user.studentId,
        phone: user.phone,
        school: user.school,
        role: user.role,
      }});
    });
  } catch (error) {
    logger.error('Error refreshing token', { error: error.message });
    res.status(500).send('Server error');
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
};