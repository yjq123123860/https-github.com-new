const { schools } = require('../config/db');
const { validationResult } = require('express-validator');

// @route   POST api/schools
// @desc    Register school
// @access  Public
const registerSchool = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address, contactPerson, contactPhone } = req.body;

  try {
    // Check if school exists
    let school = schools.find(s => s.name === name);
    if (school) {
      return res.status(400).json({ msg: 'School already exists' });
    }

    // Create new school
    const newSchool = {
      id: schools.length + 1,
      name,
      address,
      contactPerson,
      contactPhone
    };

    schools.push(newSchool);
    res.json(newSchool);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/schools
// @desc    Get all schools
// @access  Public
const getSchools = async (req, res) => {
  try {
    res.json(schools);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerSchool,
  getSchools,
};