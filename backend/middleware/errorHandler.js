const logger = require('../config/logger');

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error(err.message, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  // 定义错误状态码
  let statusCode = 500;
  let errorMessage = 'Server error';
  
  // 根据错误类型设置不同的状态码和错误信息
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Resource not found';
  } else if (err.message === 'User already exists') {
    statusCode = 400;
    errorMessage = 'User already exists';
  } else if (err.message === 'Invalid credentials') {
    statusCode = 401;
    errorMessage = 'Invalid credentials';
  }
  
  res.status(statusCode).json({
    error: errorMessage,
    // 在开发环境中显示详细错误信息
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404错误处理
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.name = 'NotFoundError';
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
