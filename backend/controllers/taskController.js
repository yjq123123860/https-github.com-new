const { tasks, users } = require('../config/db');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

// @route   POST api/tasks
// @desc    Create task
// @access  Private
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, course, time, location, price, description, publisher, contact, contactRemark } = req.body;

  try {
    // 获取当前用户信息
    const currentUser = users.find(u => u.id === req.user.userId);
    
    const task = {
      id: tasks.length + 1,
      title,
      course,
      time,
      location,
      price,
      description,
      publisher,
      contact,
      contactRemark: contactRemark || '', // 联系备注
      status: '待接取',
      publisherId: req.user.userId,
      publisherOpenid: req.user.openid || currentUser?.openid, // 发布者openid
      publisherNickname: currentUser?.nickname || publisher, // 发布者昵称
      publisherAvatar: currentUser?.avatar || '', // 发布者头像
      acceptorId: null,
      acceptorOpenid: null,
      acceptorNickname: null,
      acceptorContactRemark: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(task);
    logger.info(`Task created: ${task.id} by user ${req.user.userId}`);
    res.json(task);
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).send('Server error');
  }
};

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    // 返回任务列表，包含发布者信息
    const tasksWithPublisher = tasks.map(task => {
      const publisher = users.find(u => u.id === task.publisherId);
      return {
        ...task,
        publisherNickname: publisher?.nickname || task.publisher,
        publisherAvatar: publisher?.avatar || '',
      };
    });
    res.json(tasksWithPublisher);
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).send('Server error');
  }
};

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Public
const getTaskById = async (req, res) => {
  try {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    // 获取发布者信息
    const publisher = users.find(u => u.id === task.publisherId);
    // 获取接单者信息（如果有）
    const acceptor = task.acceptorId ? users.find(u => u.id === task.acceptorId) : null;
    
    const taskWithDetails = {
      ...task,
      publisherNickname: publisher?.nickname || task.publisher,
      publisherAvatar: publisher?.avatar || '',
      publisherContactRemark: publisher?.contactRemark || '',
      acceptorNickname: acceptor?.nickname || task.acceptorNickname,
      acceptorAvatar: acceptor?.avatar || '',
      acceptorContactRemark: acceptor?.contactRemark || '',
    };
    
    res.json(taskWithDetails);
  } catch (error) {
    logger.error('Get task by id error:', error);
    res.status(500).send('Server error');
  }
};

// @route   GET api/tasks/user/:userId
// @desc    Get tasks by user ID
// @access  Private
const getTasksByUserId = async (req, res) => {
  try {
    const userTasks = tasks.filter(t => t.publisherId === parseInt(req.params.userId));
    res.json(userTasks);
  } catch (error) {
    logger.error('Get tasks by user id error:', error);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/tasks/:id
// @desc    Update task status
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.status = status;
    task.updatedAt = new Date();
    res.json(task);
  } catch (error) {
    logger.error('Update task status error:', error);
    res.status(500).send('Server error');
  }
};

// @route   POST api/tasks/:id/accept
// @desc    Accept task
// @access  Private
const acceptTask = async (req, res) => {
  try {
    let task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.status !== '待接取') {
      return res.status(400).json({ msg: 'Task is not available' });
    }

    // 获取当前用户信息
    const currentUser = users.find(u => u.id === req.user.userId);

    task.status = '已接取';
    task.acceptorId = req.user.userId;
    task.acceptorOpenid = req.user.openid || currentUser?.openid;
    task.acceptorNickname = currentUser?.nickname;
    task.acceptorContactRemark = currentUser?.contactRemark || '';
    task.updatedAt = new Date();

    logger.info(`Task ${task.id} accepted by user ${req.user.userId}`);
    res.json(task);
  } catch (error) {
    logger.error('Accept task error:', error);
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
const deleteTask = async (req, res) => {
  try {
    let task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if user is the publisher
    if (task.publisherId.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    logger.info(`Task ${req.params.id} deleted by user ${req.user.userId}`);
    res.json({ msg: 'Task removed' });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTasksByUserId,
  updateTaskStatus,
  acceptTask,
  deleteTask,
};
