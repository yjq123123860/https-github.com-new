import { useState, useEffect } from 'react';
import { useServiceStore } from '../store/index';
import { Link } from 'react-router-dom';

function Services() {
  const { services, setServices, filters, setFilters } = useServiceStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // 模拟获取服务列表
    const mockServices = [
      {
        id: 1,
        title: '快递代取',
        type: 'express',
        description: '帮我取一下快递，放在宿舍楼下即可',
        price: 10,
        location: '北京大学 学生宿舍区',
        deadline: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        publisherName: '张三',
        publisherSchool: '北京大学',
        publisherAvatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512'
      },
      {
        id: 2,
        title: '自习室预约',
        type: 'study',
        description: '帮我预约明天的自习室，需要靠窗的位置',
        price: 5,
        location: '清华大学 图书馆',
        deadline: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        publisherName: '李四',
        publisherSchool: '清华大学',
        publisherAvatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=512x512'
      }
    ];
    setServices(mockServices);
  }, [setServices]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  // 简单的加载状态
  if (!services || services.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
              <div className="mb-4">
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">互助服务</h1>
          <p className="text-gray-600">发现附近的校园互助服务</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="搜索服务..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部服务</option>
            <option value="express">快递代取</option>
            <option value="study">自习室预约</option>
            <option value="notes">学业笔记</option>
            <option value="secondhand">二手交易</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">暂无服务</h3>
            <p className="text-gray-600 mt-2">成为第一个发布服务的人吧！</p>
          </div>
        ) : (
          services.map((service) => (
            <Link to={`/services/${service.id}`} key={service.id} className="block hover:shadow-md transition-shadow duration-200">
              <div className="bg-white rounded-lg border p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{service.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {service.location}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 line-clamp-2">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-blue-600">¥{service.price}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(service.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">发布者: {service.publisherName}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Services;