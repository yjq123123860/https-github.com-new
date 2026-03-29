import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  BookOpen, 
  ShoppingBag, 
  MapPin, 
  Search,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServiceStore, useLocationStore } from '../store/index';
import { serviceApi } from '../api';
import toast from 'react-hot-toast';

const serviceTypes = [
  { id: 'express', name: '快递代取', icon: Package, color: 'bg-blue-500' },
  { id: 'study', name: '自习室预约', icon: BookOpen, color: 'bg-green-500' },
  { id: 'notes', name: '笔记共享', icon: BookOpen, color: 'bg-purple-500' },
  { id: 'secondhand', name: '二手交易', icon: ShoppingBag, color: 'bg-orange-500' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { services, setServices } = useServiceStore();
  const { currentLocation, selectedSchool } = useLocationStore();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await serviceApi.getServices({ limit: 8 });
      setServices(response.data);
    } catch (error) {
      console.error('加载服务失败:', error);
      toast.error('加载服务失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              校园互助，<span className="text-secondary-200">温暖相伴</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              快递代取、自习室预约、笔记共享、二手交易<br />
              一站式校园互助服务平台
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索服务、物品或地点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-colors"
                >
                  搜索
                </button>
              </div>
            </form>

            {/* Location Info */}
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>
                {selectedSchool?.name || currentLocation?.address || '定位中...'}
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Service Types */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          热门服务
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {serviceTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/services?type=${type.id}`}
                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className={`${type.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">最新发布</h2>
            <Link 
              to="/services" 
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部 <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">暂无服务</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: '实名认证',
                description: '严格的学生身份认证，确保交易安全可靠',
              },
              {
                icon: Clock,
                title: '快速响应',
                description: '平均5分钟内接单，高效完成互助服务',
              },
              {
                icon: Package,
                title: '交易担保',
                description: '平台资金托管，确认完成后才结算',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service }) {
  const typeColors = {
    express: 'bg-blue-100 text-blue-700',
    study: 'bg-green-100 text-green-700',
    notes: 'bg-purple-100 text-purple-700',
    secondhand: 'bg-orange-100 text-orange-700',
  };

  const typeNames = {
    express: '快递代取',
    study: '自习室预约',
    notes: '笔记共享',
    secondhand: '二手交易',
  };

  return (
    <Link to={`/services/${service.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video bg-gray-100 relative">
          {service.image ? (
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <Package className="w-12 h-12 text-primary-400" />
            </div>
          )}
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${typeColors[service.type] || 'bg-gray-100 text-gray-700'}`}>
            {typeNames[service.type] || '其他'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {service.title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {service.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary-600 font-bold">¥{service.price}</span>
            <span className="text-gray-400 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {service.distance || '附近'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
