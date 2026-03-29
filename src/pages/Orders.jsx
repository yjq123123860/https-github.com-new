import { useState, useEffect } from 'react';
import { useOrderStore } from '../store/index';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, User, MapPin, DollarSign } from 'lucide-react';

function Orders() {
  const { orders, setOrders, updateOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // 模拟获取订单列表
    const mockOrders = [
      {
        id: 1,
        serviceId: 1,
        serviceTitle: '快递代取',
        price: 10,
        location: '北京大学 学生宿舍区',
        status: 'pending',
        role: 'publisher',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        serviceId: 2,
        serviceTitle: '自习室预约',
        price: 5,
        location: '清华大学 图书馆',
        status: 'accepted',
        role: 'publisher',
        createdAt: new Date().toISOString()
      }
    ];
    setOrders(mockOrders);
  }, [setOrders]);

  const handleCompleteOrder = (orderId) => {
    updateOrder(orderId, { status: 'completed' });
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  // 简单的加载状态
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            全部
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            待接单
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'accepted' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('accepted')}
          >
            进行中
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </button>
        </div>
        {renderOrderList(filteredOrders)}
      </div>
    </div>
  );

  function renderOrderList(ordersList) {
    if (ordersList.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">暂无订单</h3>
          <p className="text-gray-600 mt-2">您还没有任何订单</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Link to="/services">浏览服务</Link>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ordersList.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{order.serviceTitle}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'pending' ? 'bg-blue-100 text-blue-800' : order.status === 'accepted' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                  {order.status === 'pending' ? '待接单' : 
                   order.status === 'accepted' ? '进行中' : '已完成'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                订单号: {order.id}
              </p>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{order.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-blue-600">¥{order.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>
                    {order.role === 'publisher' ? '服务发布者' : '服务接单人'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                <Link to={`/services/${order.serviceId}`}>查看服务</Link>
              </button>
              {order.role === 'publisher' && order.status === 'accepted' && (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  onClick={() => handleCompleteOrder(order.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                  确认完成
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Orders;