import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { wechatApi } from '../api';
import { useAuthStore } from '../store/index';
import toast from 'react-hot-toast';

/**
 * 微信授权回调页面
 * 处理微信授权后的回调，获取code并完成登录
 */
export default function WechatCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleWechatCallback = async () => {
      try {
        // 获取URL参数
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        console.log('微信回调收到:', { code, state });
        
        if (!code) {
          setError('授权失败：未获取到授权码');
          setIsProcessing(false);
          return;
        }

        // 调用后端登录接口
        // 后端会使用code + appID + appsecret 换取 openid 和用户信息
        const response = await wechatApi.login(code, null);
        
        if (response.data.success) {
          const { token, user } = response.data;
          
          // 保存登录态
          localStorage.setItem('token', token);
          setUser(user);
          
          toast.success(`欢迎 ${user.nickname || '用户'}！`);
          
          // 解析之前保存的页面路径
          let redirectPath = '/';
          if (state) {
            try {
              const stateObj = JSON.parse(atob(state));
              redirectPath = stateObj.path || '/';
            } catch (e) {
              console.error('解析state失败:', e);
              redirectPath = '/';
            }
          }
          
          navigate(redirectPath, { replace: true });
        } else {
          setError(response.data.msg || '登录失败');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('微信回调处理错误:', err);
        const errorMsg = err.response?.data?.msg || '登录处理失败，请稍后重试';
        setError(errorMsg);
        setIsProcessing(false);
      }
    };

    handleWechatCallback();
  }, [searchParams, setUser, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">正在登录...</h2>
          <p className="text-gray-600">请稍候，正在完成微信授权</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">登录失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              返回登录页
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
