import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTaskStore, useUserStore } from '../store';

function TaskDetail() {
  const { id } = useParams();
  const { getTaskById, updateTask } = useTaskStore();
  const { user } = useUserStore();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const taskData = getTaskById(id);
    if (taskData) {
      setTask(taskData);
    } else {
      navigate('/dashboard');
    }
  }, [id, getTaskById, navigate]);

  const handleAcceptTask = () => {
    if (task) {
      updateTask(task.id, { status: '已接取' });
      setTask({ ...task, status: '已接取' });
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

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
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
            <span className="mr-2">←</span> 返回任务列表
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* 任务头部 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                <div className="mt-2 flex items-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === '待接取' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {task.status}
                  </span>
                  <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">发布者: {task.publisher}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{task.price}</p>
              </div>
            </div>
          </div>

          {/* 任务详情 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">任务信息</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">课程名称</p>
                    <p className="text-gray-900 dark:text-white">{task.course}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">上课时间</p>
                    <p className="text-gray-900 dark:text-white">{task.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">上课地点</p>
                    <p className="text-gray-900 dark:text-white">{task.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">联系方式</p>
                    <p className="text-gray-900 dark:text-white">{task.contact}</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">任务描述</h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{task.description}</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 flex justify-end">
              {task.status === '待接取' && user && task.publisherId !== user.id && (
                <button
                  className="dai-ke-gradient text-white px-6 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
                  onClick={handleAcceptTask}
                >
                  接取任务
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;