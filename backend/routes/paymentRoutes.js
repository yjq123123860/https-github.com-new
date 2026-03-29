const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// @route   POST api/payment/alipay
// @desc    创建支付宝支付订单
// @access  Private
router.post('/alipay', auth, [
  check('taskId', 'Task ID is required').not().isEmpty(),
  check('amount', 'Amount is required').not().isEmpty(),
  check('subject', 'Subject is required').not().isEmpty(),
], paymentController.createAlipayOrder);

// @route   POST api/payment/wechat
// @desc    创建微信支付订单
// @access  Private
router.post('/wechat', auth, [
  check('taskId', 'Task ID is required').not().isEmpty(),
  check('amount', 'Amount is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('openid', 'OpenID is required').not().isEmpty(),
], paymentController.createWechatOrder);

// @route   POST api/payment/alipay/notify
// @desc    支付宝支付回调
// @access  Public
router.post('/alipay/notify', paymentController.alipayNotify);

// @route   POST api/payment/wechat/notify
// @desc    微信支付回调
// @access  Public
router.post('/wechat/notify', paymentController.wechatNotify);

module.exports = router;
