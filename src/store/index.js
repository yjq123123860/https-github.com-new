import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      wechatConfig: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      
      setWechatConfig: (config) => set({ wechatConfig: config }),
      
      // 微信登录
      wechatLogin: async (code, userInfo) => {
        set({ isLoading: true });
        try {
          const { wechatApi } = await import('../api/index');
          const response = await wechatApi.login(code, userInfo);
          
          if (response.data.success) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ user, isAuthenticated: true, isLoading: false });
            return { success: true, user };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.msg || '微信登录失败' };
        }
      },
      
      // 获取微信配置
      fetchWechatConfig: async () => {
        try {
          const { wechatApi } = await import('../api/index');
          const response = await wechatApi.getConfig();
          set({ wechatConfig: response.data });
          return response.data;
        } catch (error) {
          console.error('获取微信配置失败:', error);
          return null;
        }
      },
      
      // 更新联系备注
      updateContactRemark: async (contactRemark) => {
        try {
          const { wechatApi } = await import('../api/index');
          const response = await wechatApi.updateContactRemark(contactRemark);
          if (response.data.success) {
            set((state) => ({
              user: state.user ? { ...state.user, contactRemark } : null,
            }));
            return { success: true };
          }
        } catch (error) {
          return { success: false, error: error.response?.data?.msg || '更新失败' };
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useLocationStore = create((set) => ({
  currentLocation: null,
  selectedSchool: null,
  nearbySchools: [],
  
  setLocation: (location) => set({ currentLocation: location }),
  setSelectedSchool: (school) => set({ selectedSchool: school }),
  setNearbySchools: (schools) => set({ nearbySchools: schools }),
}));

export const useServiceStore = create((set) => ({
  services: [],
  currentService: null,
  filters: {
    type: 'all',
    sortBy: 'distance',
    priceRange: [0, 1000],
  },
  
  setServices: (services) => set({ services }),
  setCurrentService: (service) => set({ currentService: service }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  addService: (service) => set((state) => ({ services: [service, ...state.services] })),
}));

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
  })),
}));

export const useMessageStore = create((set) => ({
  conversations: [],
  currentConversation: null,
  unreadCount: 0,
  
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, message], lastMessage: message }
        : c
    ),
  })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
