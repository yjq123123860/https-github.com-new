import { create } from 'zustand';

// 用户状态管理
export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null }),
}));

// 任务状态管理
export const useTaskStore = create((set, get) => ({
  tasks: [
    {
      id: 1,
      title: '高等数学上册代课',
      course: '高等数学',
      time: '2026-04-01 14:00-16:00',
      location: '教学主楼 301',
      price: '80元',
      publisher: '小明',
      contact: '138****1234',
      status: '待接取',
      description: '需要认真听讲，做好笔记',
      publisherId: 2
    },
    {
      id: 2,
      title: '大学物理实验代课',
      course: '大学物理',
      time: '2026-04-02 09:00-11:00',
      location: '实验楼 202',
      price: '100元',
      publisher: '小红',
      contact: '139****5678',
      status: '待接取',
      description: '需要完成实验报告',
      publisherId: 3
    },
    {
      id: 3,
      title: '线性代数代课',
      course: '线性代数',
      time: '2026-04-03 10:00-12:00',
      location: '教学副楼 205',
      price: '70元',
      publisher: '小刚',
      contact: '137****9012',
      status: '已接取',
      description: '需要签到并记录重点',
      publisherId: 4
    }
  ],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { id: state.tasks.length + 1, ...task, status: '待接取' }]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  getTaskById: (id) => get().tasks.find(task => task.id === parseInt(id))
}));

// 学校状态管理
export const useSchoolStore = create((set) => ({
  schools: [
    { id: 1, name: '北京大学' },
    { id: 2, name: '清华大学' },
    { id: 3, name: '复旦大学' },
    { id: 4, name: '上海交通大学' },
    { id: 5, name: '浙江大学' }
  ],
  addSchool: (school) => set((state) => ({
    schools: [...state.schools, { id: state.schools.length + 1, ...school }]
  }))
}));