import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore, useAuthStore } from '../store/index';
import { serviceApi } from '../api';
import { MapPin, Clock, DollarSign, Image as ImageIcon, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

function Publish() {
  const navigate = useNavigate();
  const { addService } = useServiceStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    type: 'express',
    description: '',
    price: '',
    location: '',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 默认明天
    images: [],
    contactRemark: '' // 联系备注
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    { value: 'express', label: '快递代取' },
    { value: 'study', label: '自习室预约' },
    { value: 'notes', label: '学业笔记' },
    { value: 'secondhand', label: '二手交易' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '请输入服务标题';
    if (!formData.description.trim()) newErrors.description = '请输入服务描述';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = '请输入有效的价格';
    }
    if (!formData.location.trim()) newErrors.location = '请输入服务地点';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 调用后端API创建服务
      const serviceData = {
        title: formData.title,
        course: formData.type, // 使用type作为course
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        time: formData.deadline.toISOString(),
        publisher: user?.nickname || '匿名用户',
        contact: user?.openid || '',
        contactRemark: formData.contactRemark, // 联系备注
      };

      const response = await serviceApi.createService(serviceData);
      
      if (response.data) {
        addService(response.data);
        toast.success('服务发布成功！');
        navigate('/services');
      }
    } catch (error) {
      console.error('发布服务失败:', error);
      toast.error(error.response?.data?.msg || '发布服务失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">发布互助服务</h1>
      
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-6">服务信息</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">服务标题</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="请输入服务标题"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">服务类型</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">服务描述</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请详细描述您的服务需求..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">服务价格</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className={`w-full pl-8 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">服务地点</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="请输入服务地点"
                  className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">截止时间</label>
              <input
                id="deadline"
                type="datetime-local"
                value={formData.deadline.toISOString().slice(0, 16)}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: new Date(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 联系备注 */}
          <div className="space-y-2">
            <label htmlFor="contactRemark" className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                联系备注（可选）
              </div>
            </label>
            <input
              id="contactRemark"
              type="text"
              value={formData.contactRemark}
              onChange={(e) => setFormData(prev => ({ ...prev, contactRemark: e.target.value }))}
              placeholder="例如：微信同号、手机号138xxxx、晚上联系等"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              提示：您可以填写方便对方联系您的方式，如微信、手机号或其他备注信息
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">上传图片（可选）</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  选择图片
                </button>
              </div>
              <span className="text-sm text-gray-500">最多上传5张图片</span>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`预览 ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/services')}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '发布中...' : '发布服务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Publish;
