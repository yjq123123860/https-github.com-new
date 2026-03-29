const { validationResult } = require('express-validator');
const AlipaySdk = require('alipay-sdk').default;
const { Pay } = require('wechatpay-node-v3');
const paymentConfig = require('../config/payment');
const { tasks } = require('../config/db');

// 初始化支付宝SDK
let alipaySdk = null;
if (paymentConfig.alipay.appId) {
  alipaySdk = new AlipaySdk({
    appId: paymentConfig.alipay.appId,
    privateKey: paymentConfig.alipay.privateKey,
    alipayPublicKey: paymentConfig.alipay.publicKey,
  });
}

// 初始化微信支付
let wechatPay = null;
if (paymentConfig.wechat.appId && paymentConfig.wechat.mchId) {
  wechatPay = new Pay({
    appid: paymentConfig.wechat.appId,
    mchid: paymentConfig.wechat.mchId,
    publicKey: '', // 微信支付平台证书
    privateKey: paymentConfig.wechat.apiKey,
  });
}

// @route   POST api/payment/alipay
// @desc    创建支付宝支付订单
// @access  Private
const createAlipayOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!alipaySdk) {
    return res.status(500).json({ msg: 'Alipay SDK is not initialized' });
  }

  const { taskId, amount, subject } = req.body;

  try {
    // 生成订单号
    const outTradeNo = `ALIPAY${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // 调用支付宝SDK创建订单
    const result = await alipaySdk.exec('alipay.trade.page.pay', {
      method: 'GET',
      params: {
        out_trade_no: outTradeNo,
        total_amount: amount,
        subject: subject,
        product_code: 'FAST_INSTANT_TRADE_PAY',
        notify_url: paymentConfig.alipay.notifyUrl,
        return_url: paymentConfig.alipay.returnUrl,
      },
      timeout: 5000,
    });

    res.json({ paymentUrl: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/payment/wechat
// @desc    创建微信支付订单
// @access  Private
const createWechatOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!wechatPay) {
    return res.status(500).json({ msg: 'WeChat Pay is not initialized' });
  }

  const { taskId, amount, description } = req.body;

  try {
    // 生成订单号
    const outTradeNo = `WECHAT${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // 调用微信支付API创建订单
    const result = await wechatPay.transactions_jsapi({
      description,
      out_trade_no: outTradeNo,
      notify_url: paymentConfig.wechat.notifyUrl,
      amount: {
        total: amount * 100, // 微信支付金额单位为分
        currency: 'CNY',
      },
      payer: {
        openid: req.body.openid, // 微信用户openid
      },
    });

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/payment/alipay/notify
// @desc    支付宝支付回调
// @access  Public
const alipayNotify = async (req, res) => {
  if (!alipaySdk) {
    return res.status(500).send('Alipay SDK is not initialized');
  }

  try {
    // 验证支付宝回调签名
    const verifyResult = alipaySdk.checkNotifySign(req.body);
    if (!verifyResult) {
      return res.status(400).send('Invalid signature');
    }

    // 处理支付成功逻辑
    if (req.body.trade_status === 'TRADE_SUCCESS' || req.body.trade_status === 'TRADE_FINISHED') {
      // 更新任务状态
      const taskId = req.body.out_trade_no;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.status = '已支付';
      }
    }

    res.send('success');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/payment/wechat/notify
// @desc    微信支付回调
// @access  Public
const wechatNotify = async (req, res) => {
  if (!wechatPay) {
    return res.status(500).send('WeChat Pay is not initialized');
  }

  try {
    // 处理微信支付回调
    const result = await wechatPay.parseNotify(req.body);
    
    // 处理支付成功逻辑
    if (result.transaction_id) {
      // 更新任务状态
      const taskId = result.out_trade_no;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.status = '已支付';
      }
    }

    res.send({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createAlipayOrder,
  createWechatOrder,
  alipayNotify,
  wechatNotify,
};
