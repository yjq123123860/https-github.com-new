const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // 支付宝配置
  alipay: {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    publicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || 'http://localhost:5000/api/payment/alipay/notify',
    returnUrl: process.env.ALIPAY_RETURN_URL || 'http://localhost:3000/payment/success'
  },
  // 微信支付配置
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    notifyUrl: process.env.WECHAT_NOTIFY_URL || 'http://localhost:5000/api/payment/wechat/notify'
  }
};
