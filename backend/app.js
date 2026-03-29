const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const logger = require('./config/logger');

// Routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wechatRoutes = require('./routes/wechatRoutes');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/services', taskRoutes); // Add services route as alias for tasks
app.use('/api/schools', schoolRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/wechat', wechatRoutes); // 微信登录路由

// Health check
app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to Dai Ke Bang API' });
});

// Monitoring endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'dai-ke-bang-api'
  });
});

// Error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

module.exports = app;