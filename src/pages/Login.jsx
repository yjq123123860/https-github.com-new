import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone, Lock, User, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/index';
import { userApi } from '../api';
import WechatLoginButton from '../components/WechatLoginButton';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    realName: '',
    studentId: '',
    phone: '',
    school: '',
    email: '',
    verificationCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录
        const response = await userApi.login({
          username: formData.username,
          password: formData.password,
        });
        
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('登录成功！');
        navigate('/');
      } else {
        // 注册
        if (!formData.username || !formData.password || !formData.realName || !formData.phone || !formData.school) {
          toast.error('请填写所有必填项');
          setIsLoading(false);
          return;
        }

        const response = await userApi.register({
          username: formData.username,
          password: formData.password,
          realName: formData.realName,
          studentId: formData.studentId,
          phone: formData.phone,
          school: formData.school,
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('注册成功！');
        navigate('/');
      }
    } catch (error) {
      console.error('操作失败:', error);
      toast.error(error.response?.data?.msg || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!formData.phone) {
      toast.error('请先输入手机号');
      return;
    }
    
    try {
      await userApi.sendVerificationCode(formData.phone);
      toast.success('验证码已发送（模拟：123456）');
    } catch (error) {
      toast.error('发送验证码失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? '登录以继续' : '注册加入校园互助平台'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="请输入密码"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              {/* 真实姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  真实姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="realName"
                    value={formData.realName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="请输入真实姓名"
                    required
                  />
                </div>
              </div>

              {/* 手机号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="请输入手机号"
                    required
                  />
                </div>
              </div>

              {/* 学校 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  学校
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="请输入学校名称"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  支持学校邮箱验证，如 @mail.scu.edu.cn
                </p>
              </div>

              {/* 学号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  学号（可选）
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="请输入学号"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin ? '还没有账号？立即注册' : '已有账号？立即登录'}
          </button>
        </div>

        {/* 其他登录方式 */}
        {isLogin && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">其他登录方式</span>
              </div>
            </div>
            
            {/* 微信登录按钮 */}
            <div className="mt-4">
              <WechatLoginButton 
                onSuccess={(user) => {
                  setUser(user);
                  navigate('/');
                }}
              />
            </div>
            
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => toast.success('手机号验证码登录（模拟）')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm">手机号登录</span>
              </button>
              <button
                onClick={() => toast.success('学校邮箱登录（模拟）')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm">学校邮箱</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
