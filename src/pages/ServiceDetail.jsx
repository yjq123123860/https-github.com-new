import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useServiceStore, useAuthStore } from '../store/index';
import { serviceApi } from '../api';
import { MessageSquare, MapPin, Clock, DollarSign, User, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, currentService, setCurrentService } = useServiceStore();
  const { isAuthenticated, user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 从后端获取服务详情
    const fetchServiceDetail = async () => {
      try {
        const response = await serviceApi.getServiceById(id);
        setCurrentService(response.data);
      } catch (error) {
        console.error('获取服务详情失败:', error);
        toast.error('获取服务详情失败');
      }
    };

    fetchServiceDetail();
  }, [id, setCurrentService]);

  const handleAcceptService = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await serviceApi.acceptService(id);
      toast.success('接单成功！');
      setCurrentService(response.data);
    } catch (error) {
      console.error('接单失败:', error);
      toast.error(error.response?.data?.msg || '接单失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 简单的加载状态
  if (!currentService) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">服务不存在</h1>
        <p className="text-gray-600 mb-6">您访问的服务不存在或已被删除</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Link to="/services">返回服务列表</Link>
        </button>
      </div>
    );
  }

  const isPublisher = user?.id === currentService.publisherId;
  const isAccepted = currentService.status === '已接取';
  const isCompleted = currentService.status === '已完成';

  return (
    <div className="container mx-auto py-8">
      <Link to="/services" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回服务列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{currentService.title}</h1>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  currentService.status === '待接取' ? 'bg-green-100 text-green-800' :
                  currentService.status === '已接取' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentService.status}
                </span>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                {currentService.location}
              </p>
            </div>
            <div className="mb-4">
              <div className="prose max-w-none">
                <p>{currentService.description}</p>
                {currentService.images && currentService.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {currentService.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`服务图片 ${index + 1}`} 
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>截止时间: {new Date(currentService.time || currentService.deadline).toLocaleString('zh-CN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-blue-600">¥{currentService.price}</span>
                </div>
              </div>
            </div>
            
            {/* 发布者信息 */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    {currentService.publisherAvatar ? (
                      <img 
                        src={currentService.publisherAvatar} 
                        alt={currentService.publisherNickname} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-full h-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{currentService.publisherNickname || currentService.publisher}</p>
                    <p className="text-sm text-gray-500">发布者</p>
                  </div>
                </div>
                
                {/* 接单按钮 */}
                {!isPublisher && !isAccepted && !isCompleted && (
                  <button 
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleAcceptService}
                    disabled={isLoading}
                  >
                    {isLoading ? '处理中...' : '我来接单'}
                  </button>
                )}
                
                {isAccepted && (
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    已被接单
                  </span>
                )}
              </div>
              
              {/* 联系备注 */}
              {currentService.contactRemark && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">联系备注：</span>
                    {currentService.contactRemark}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 接单者信息 */}
          {isAccepted && currentService.acceptorId && (
            <div className="mt-6 bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">接单者信息</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                  {currentService.acceptorAvatar ? (
                    <img 
                      src={currentService.acceptorAvatar} 
                      alt={currentService.acceptorNickname} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{currentService.acceptorNickname}</p>
                  <p className="text-sm text-gray-500">接单者</p>
                </div>
              </div>
              
              {/* 接单者联系备注 */}
              {currentService.acceptorContactRemark && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">联系备注：</span>
                    {currentService.acceptorContactRemark}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">交流区</h3>
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  还没有消息，开始交流吧！
                </div>
              </div>
              {isAuthenticated && (
                <div className="border-t mt-4 pt-4">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      placeholder="输入消息..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">发送</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">服务信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">服务类型</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{currentService.type || currentService.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">价格</span>
                  <span className="font-semibold text-blue-600">¥{currentService.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">发布时间</span>
                  <span className="text-sm">{new Date(currentService.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">截止时间</span>
                  <span className="text-sm">{new Date(currentService.time || currentService.deadline).toLocaleString('zh-CN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">状态</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentService.status === '待接取' ? 'bg-green-100 text-green-800' :
                    currentService.status === '已接取' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentService.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">发布者信息</h3>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {currentService.publisherAvatar ? (
                    <img 
                      src={currentService.publisherAvatar} 
                      alt={currentService.publisherNickname} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-400" />
                  )}
                </div>
                <h4 className="font-medium">{currentService.publisherNickname || currentService.publisher}</h4>
                <p className="text-sm text-gray-500 mb-2">{currentService.publisherSchool || '未设置学校'}</p>
                
                {/* 联系备注 */}
                {currentService.publisherContactRemark && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800 w-full">
                    <span className="font-medium">联系备注：</span>
                    {currentService.publisherContactRemark}
                  </div>
                )}
                
                <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  发送消息
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
