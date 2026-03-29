import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.msg || error.message || '请求失败';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('登录已过期，请重新登录');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  verifyEmail: (data) => api.post('/users/verify-email', data),
  sendVerificationCode: (phone) => api.post('/users/send-code', { phone }),
};

// 服务相关API
export const serviceApi = {
  getServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
  acceptService: (id) => api.post(`/services/${id}/accept`),
};

// 订单相关API
export const orderApi = {
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  confirmOrder: (id) => api.post(`/orders/${id}/confirm`),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};

// 支付相关API
export const paymentApi = {
  createPayment: (data) => api.post('/payment/create', data),
  confirmPayment: (id) => api.post(`/payment/${id}/confirm`),
};

// 学校相关API
export const schoolApi = {
  getSchools: () => api.get('/schools'),
  getSchoolById: (id) => api.get(`/schools/${id}`),
};

// 消息相关API
export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
};

// 位置相关API
export const locationApi = {
  getLocation: () => api.get('/location'),
  searchSchools: (query) => api.get('/schools/search', { params: { q: query } }),
};

// 微信登录相关API
export const wechatApi = {
  // 微信登录
  login: (code, userInfo) => api.post('/wechat/login', { code, userInfo }),
  // 获取微信配置
  getConfig: () => api.get('/wechat/config'),
  // 获取用户信息
  getProfile: () => api.get('/wechat/profile'),
  // 更新联系备注
  updateContactRemark: (contactRemark) => api.put('/wechat/contact-remark', { contactRemark }),
};

export default api;
