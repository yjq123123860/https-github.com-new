const QRCode = require('qrcode');

const appId = 'wx1a94ffd4e33c32a5';
const redirectUri = encodeURIComponent('https://evil-islands-sort.loca.lt/wechat/callback');
const scope = 'snsapi_base';
const state = 'test123';

const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

console.log('=== 微信授权链接 ===');
console.log(authUrl);
console.log('\n=== 生成二维码中... ===');

QRCode.toFile('./wechat-auth-qr-new.png', authUrl, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function(err) {
  if (err) {
    console.error('生成二维码失败:', err);
    return;
  }
  console.log('二维码已生成: ./wechat-auth-qr-new.png');
  console.log('\n请用微信扫描上方二维码进行测试！');
});
