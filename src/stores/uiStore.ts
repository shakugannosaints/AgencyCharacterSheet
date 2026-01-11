/**
 * UI 状态管理
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TabType, ModalType, Notification } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// 主题类型
export type ThemeMode = 'night' | 'day';

interface UIState {
  // 当前主题
  theme: ThemeMode;
  
  // 当前激活的标签页
  activeTab: TabType;
  
  // 当前打开的模态框
  activeModal: ModalType;
  
  // 模态框数据
  modalData: unknown;
  
  // 通知列表
  notifications: Notification[];
  
  // 是否显示侧边栏
  sidebarOpen: boolean;
  
  // 是否为移动端视图
  isMobile: boolean;
  
  // 动作
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: TabType) => void;
  openModal: (modal: ModalType, data?: unknown) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'night',
      activeTab: 'profile',
      activeModal: 'none',
      modalData: null,
      notifications: [],
      sidebarOpen: false,
      isMobile: false,

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'night' ? 'day' : 'night' });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      openModal: (modal, data) => {
        set({ activeModal: modal, modalData: data });
      },

      closeModal: () => {
        set({ activeModal: 'none', modalData: null });
      },

      addNotification: (notification) => {
        const id = uuidv4();
        const newNotification: Notification = {
          ...notification,
          id,
        };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // 自动移除
        const duration = notification.duration ?? 3000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setIsMobile: (isMobile) => {
        set({ isMobile });
      },
    }),
    {
      name: 'triangle-ui-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
