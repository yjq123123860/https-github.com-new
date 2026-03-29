const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const schoolController = require('../controllers/schoolController');

// @route   POST api/schools
// @desc    Register school
// @access  Public
router.post('/', [
  check('name', 'School name is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('contactPerson', 'Contact person is required').not().isEmpty(),
  check('contactPhone', 'Contact phone is required').not().isEmpty(),
], schoolController.registerSchool);

// @route   GET api/schools
// @desc    Get all schools
// @access  Public
router.get('/', schoolController.getSchools);

module.exports = router;