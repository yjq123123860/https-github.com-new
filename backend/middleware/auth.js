const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// 角色授权中间件
const authorize = (roles = []) => {
  // 角色可以是字符串或数组
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  auth,
  authorize
};