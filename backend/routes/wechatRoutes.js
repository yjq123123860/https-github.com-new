const express = require('express');
const router = express.Router();
const wechatController = require('../controllers/wechatController');
const { auth } = require('../middleware/auth');

// @route   POST /api/wechat/login
// @desc    微信登录/注册
// @access  Public
router.post('/login', wechatController.wechatLogin);

// @route   GET /api/wechat/config
// @desc    获取微信登录配置
// @access  Public
router.get('/config', wechatController.getWechatConfig);

// @route   GET /api/wechat/profile
// @desc    获取当前用户信息
// @access  Private
router.get('/profile', auth, wechatController.getProfile);

// @route   PUT /api/wechat/contact-remark
// @desc    更新用户联系备注
// @access  Private
router.put('/contact-remark', auth, wechatController.updateContactRemark);

module.exports = router;
