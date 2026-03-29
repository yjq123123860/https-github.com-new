const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

// @route   POST api/tasks
// @desc    Create task
// @access  Private
router.post('/', auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('course', 'Course is required').not().isEmpty(),
  check('time', 'Time is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('price', 'Price is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('publisher', 'Publisher is required').not().isEmpty(),
  check('contact', 'Contact is required').not().isEmpty(),
], taskController.createTask);

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', taskController.getTasks);

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Public
router.get('/:id', taskController.getTaskById);

// @route   GET api/tasks/user/:userId
// @desc    Get tasks by user ID
// @access  Private
router.get('/user/:userId', auth, taskController.getTasksByUserId);

// @route   PUT api/tasks/:id
// @desc    Update task status
// @access  Private
router.put('/:id', auth, taskController.updateTaskStatus);

// @route   POST api/tasks/:id/accept
// @desc    Accept task
// @access  Private
router.post('/:id/accept', auth, taskController.acceptTask);

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;