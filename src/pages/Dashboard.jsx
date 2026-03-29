import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore, useTaskStore } from '../store';

function Dashboard() {
  const { user, logout } = useUserStore();
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [activeTab, setActiveTab] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    course: '',
    time: '',
    location: '',
    price: '',
    description: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 如果未登录，跳转到登录页面
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(newTask).every(value => value)) {
      addTask({
        ...newTask,
        publisher: user.username,
        contact: user.phone || '138****1234',
        publisherId: user.id
      });
      setNewTask({
        title: '',
        course: '',
        time: '',
        location: '',
        price: '',
        description: ''
      });
      setIsModalOpen(false);
    }
  };

  const filteredTasks = activeTab === 'all' ? tasks : 
    activeTab === 'published' ? tasks.filter(task => task.publisherId === user.id) :
    tasks.filter(task => task.status === '已接取');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gradient">代课帮</span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-b-2 border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                  仪表板
                </Link>
                <Link to="/profile" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  个人资料
                </Link>
                <Link to="/" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  首页
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button className="dai-ke-gradient text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity" onClick={logout}>
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">欢迎回来，{user?.username}！</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总任务数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已完成任务</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.filter(task => task.status === '已接取').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总收益</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">¥{tasks.reduce((sum, task) => sum + parseInt(task.price), 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 任务管理 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">任务管理</h2>
              <button
                className="dai-ke-gradient text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                onClick={() => setIsModalOpen(true)}
              >
                发布任务
              </button>
            </div>
            
            {/* 标签页 */}
            <div className="mt-4 flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('all')}
              >
                全部任务
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'published' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('published')}
              >
                我发布的
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'accepted' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab('accepted')}
              >
                我接取的
              </button>
            </div>
          </div>
          
          {/* 任务列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">任务</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">课程</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">时间</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">地点</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">报酬</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">发布者: {task.publisher}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{task.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{task.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{task.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">{task.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === '待接取' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/task/${task.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">查看</Link>
                      {task.status === '待接取' && task.publisherId !== user.id && (
                        <button 
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                          onClick={() => updateTask(task.id, { status: '已接取' })}
                        >
                          接取
                        </button>
                      )}
                      {task.publisherId === user.id && (
                        <button 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() => deleteTask(task.id)}
                        >
                          删除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 发布任务模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">发布代课任务</h2>
              <button 
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  任务标题
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如：高等数学上册代课"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  课程名称
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={newTask.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如：高等数学"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  上课时间
                </label>
                <input
                  type="datetime-local"
                  id="time"
                  name="time"
                  value={newTask.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  上课地点
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newTask.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如：教学主楼 301"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  报酬
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={newTask.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如：80元"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  任务描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如：需要认真听讲，做好笔记"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 dai-ke-gradient text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;