import { useState } from 'react';
import { AlertCircle, CheckCircle, MessageSquare, Phone, Mail } from 'lucide-react';

function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'suggestion',
    subject: '',
    message: '',
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: 'suggestion', label: '功能建议' },
    { value: 'bug', label: 'bug反馈' },
    { value: 'payment', label: '支付问题' },
    { value: 'account', label: '账号问题' },
    { value: 'other', label: '其他问题' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '请输入您的姓名';
    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.subject.trim()) newErrors.subject = '请输入问题标题';
    if (!formData.message.trim()) newErrors.message = '请输入问题描述';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      // 重置表单
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'suggestion',
        subject: '',
        message: '',
        attachments: []
      });
      setErrors({});
    } catch (error) {
      console.error('提交反馈失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const attachments = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...attachments]
      }));
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">客服反馈</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">提交问题</h2>
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-green-600">提交成功！</h3>
                <p className="text-gray-600 mt-2">
                  我们已经收到您的反馈，会尽快处理并回复您。
                </p>
                <button 
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setSubmitSuccess(false)}
                >
                  提交新的反馈
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入您的姓名"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="请输入您的邮箱"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">手机号（可选）</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="请输入您的手机号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">问题类型</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">问题标题</label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="请输入问题标题"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">问题描述</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="请详细描述您遇到的问题..."
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">上传附件（可选）</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        id="attachments"
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        选择文件
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">支持图片和PDF文件</span>
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeAttachment(index)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : '提交反馈'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-6">联系我们</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">在线客服</h4>
                  <p className="text-sm text-gray-600">工作日 9:00-18:00</p>
                  <button className="mt-2 px-4 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    立即咨询
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">邮箱</h4>
                  <p className="text-sm text-gray-600">support@campushelp.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">电话</h4>
                  <p className="text-sm text-gray-600">400-123-4567</p>
                  <p className="text-sm text-gray-500">工作日 9:00-18:00</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">常见问题</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      如何修改个人信息？
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      支付失败怎么办？
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      如何取消订单？
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      账号被锁定怎么办？
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;