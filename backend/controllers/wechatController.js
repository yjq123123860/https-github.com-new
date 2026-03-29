const jwt = require('jsonwebtoken');
const axios = require('axios');
const { users, wechatAuths } = require('../config/db');
const logger = require('../config/logger');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 微信测试号参数
const WECHAT_APP_ID = 'wx1a94ffd4e33c32a5';
const WECHAT_APP_SECRET = '4adb2e31fb9ba5efbb69656bd44f0f67';
const WECHAT_REDIRECT_URI = 'https://evil-islands-sort.loca.lt/wechat/callback';

/**
 * @desc    微信登录/注册
 * @route   POST /api/wechat/login
 * @access  Public
 */
exports.wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({ msg: '微信授权码不能为空' });
    }

    try {
      // 1. 通过code换取access_token
      const tokenResponse = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
        params: {
          appid: WECHAT_APP_ID,
          secret: WECHAT_APP_SECRET,
          code: code,
          grant_type: 'authorization_code'
        }
      });

      const { access_token, openid, unionid } = tokenResponse.data;

      // 2. 通过access_token和openid获取用户信息
      const userInfoResponse = await axios.get('https://api.weixin.qq.com/sns/userinfo', {
        params: {
          access_token: access_token,
          openid: openid,
          lang: 'zh_CN'
        }
      });

      const wechatUserInfo = userInfoResponse.data;

      // 3. 查找是否已存在该微信用户
      let wechatAuth = wechatAuths.find(auth => auth.openid === openid);
      let user;

      if (wechatAuth) {
        // 已存在，查找用户信息
        user = users.find(u => u.id === wechatAuth.userId);
        
        // 更新用户信息
        if (user) {
          user.nickname = wechatUserInfo.nickname || user.nickname;
          user.avatar = wechatUserInfo.headimgurl || user.avatar;
          user.updatedAt = new Date();
        }
      } else {
        // 新用户，创建账号
        const newUserId = users.length + 1;
        
        user = {
          id: newUserId,
          openid: openid,
          nickname: wechatUserInfo.nickname || `微信用户${newUserId}`,
          avatar: wechatUserInfo.headimgurl || '',
          school: null,
          contactRemark: '', // 联系备注
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        users.push(user);
        
        // 保存微信授权信息
        wechatAuth = {
          id: wechatAuths.length + 1,
          userId: newUserId,
          openid: openid,
          unionid: unionid || null,
          createdAt: new Date()
        };
        wechatAuths.push(wechatAuth);
        
        logger.info(`New wechat user created: ${openid}`);
      }

      // 生成JWT token
      const token = jwt.sign(
        { userId: user.id, openid: user.openid },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
          school: user.school,
          contactRemark: user.contactRemark
        }
      });
    } catch (wechatError) {
      // 微信API调用失败，使用模拟数据（开发环境）
      logger.warn('Wechat API error, using mock data:', wechatError.message);
      
      // 生成模拟openid
      const openid = `wechat_${code}_openid`;
      
      // 查找是否已存在该微信用户
      let wechatAuth = wechatAuths.find(auth => auth.openid === openid);
      let user;

      if (wechatAuth) {
        // 已存在，查找用户信息
        user = users.find(u => u.id === wechatAuth.userId);
        
        // 更新用户信息（如果提供了新的用户信息）
        if (userInfo && user) {
          user.nickname = userInfo.nickName || user.nickname;
          user.avatar = userInfo.avatarUrl || user.avatar;
          user.updatedAt = new Date();
        }
      } else {
        // 新用户，创建账号
        const newUserId = users.length + 1;
        
        user = {
          id: newUserId,
          openid: openid,
          nickname: userInfo?.nickName || `微信用户${newUserId}`,
          avatar: userInfo?.avatarUrl || '',
          school: null,
          contactRemark: '', // 联系备注
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        users.push(user);
        
        // 保存微信授权信息
        wechatAuth = {
          id: wechatAuths.length + 1,
          userId: newUserId,
          openid: openid,
          unionid: null,
          createdAt: new Date()
        };
        wechatAuths.push(wechatAuth);
        
        logger.info(`New mock wechat user created: ${openid}`);
      }

      // 生成JWT token
      const token = jwt.sign(
        { userId: user.id, openid: user.openid },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
          school: user.school,
          contactRemark: user.contactRemark
        }
      });
    }
  } catch (err) {
    logger.error('Wechat login error:', err);
    res.status(500).json({ msg: '微信登录失败', error: err.message });
  }
};

/**
 * @desc    获取微信登录配置（前端用）
 * @route   GET /api/wechat/config
 * @access  Public
 */
exports.getWechatConfig = async (req, res) => {
  try {
    // 返回微信登录配置
    res.json({
      appId: WECHAT_APP_ID,
      // 微信授权回调地址
      redirectUri: WECHAT_REDIRECT_URI,
      // 微信授权作用域：snsapi_base（不获取用户信息，只验证身份）
      scope: 'snsapi_base',
      // 授权页面URL模板
      authUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize'
    });
  } catch (err) {
    logger.error('Get wechat config error:', err);
    res.status(500).json({ msg: '获取微信配置失败' });
  }
};

/**
 * @desc    更新用户联系备注
 * @route   PUT /api/wechat/contact-remark
 * @access  Private
 */
exports.updateContactRemark = async (req, res) => {
  try {
    const { contactRemark } = req.body;
    const userId = req.user.userId;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ msg: '用户不存在' });
    }

    user.contactRemark = contactRemark || '';
    user.updatedAt = new Date();

    res.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        contactRemark: user.contactRemark
      }
    });
  } catch (err) {
    logger.error('Update contact remark error:', err);
    res.status(500).json({ msg: '更新联系备注失败' });
  }
};

/**
 * @desc    获取当前用户信息
 * @route   GET /api/wechat/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ msg: '用户不存在' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        school: user.school,
        contactRemark: user.contactRemark,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    logger.error('Get profile error:', err);
    res.status(500).json({ msg: '获取用户信息失败' });
  }
};
