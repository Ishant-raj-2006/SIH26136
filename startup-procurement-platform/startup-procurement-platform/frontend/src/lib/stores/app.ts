import { create } from 'zustand';
import { Challenge, Startup, Notification, DashboardStats } from '@/types';
import { apiClient } from '@/lib/api';

interface AppStore {
  // Challenges
  challenges: Challenge[];
  challengesLoading: boolean;
  fetchChallenges: (skip?: number, limit?: number, status?: string) => Promise<void>;
  
  // Startups
  startups: Startup[];
  startupsLoading: boolean;
  fetchStartups: (skip?: number, limit?: number, search?: string) => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  notificationsLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  
  // Dashboard Stats
  stats: DashboardStats | null;
  statsLoading: boolean;
  fetchDashboardStats: () => Promise<void>;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Challenges
  challenges: [],
  challengesLoading: false,
  fetchChallenges: async (skip = 0, limit = 10, status?) => {
    set({ challengesLoading: true });
    try {
      const response = await apiClient.listChallenges(skip, limit, status);
      set({ challenges: response.data, challengesLoading: false });
    } catch (error) {
      set({ challengesLoading: false, error: 'Failed to fetch challenges' });
    }
  },

  // Startups
  startups: [],
  startupsLoading: false,
  fetchStartups: async (skip = 0, limit = 10, search?) => {
    set({ startupsLoading: true });
    try {
      const response = await apiClient.listStartups(skip, limit, search);
      set({ startups: response.data, startupsLoading: false });
    } catch (error) {
      set({ startupsLoading: false, error: 'Failed to fetch startups' });
    }
  },

  // Notifications
  notifications: [],
  unreadCount: 0,
  notificationsLoading: false,
  fetchNotifications: async () => {
    set({ notificationsLoading: true });
    try {
      const response = await apiClient.getNotifications(0, 50);
      set({
        notifications: response.data,
        unreadCount: response.unread || 0,
        notificationsLoading: false,
      });
    } catch (error) {
      set({ notificationsLoading: false });
    }
  },

  markNotificationRead: async (id: number) => {
    try {
      await apiClient.markNotificationRead(id);
      const { notifications } = get();
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      set({
        notifications: updated,
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (error) {
      set({ error: 'Failed to mark notification as read' });
    }
  },

  // Dashboard Stats
  stats: null,
  statsLoading: false,
  fetchDashboardStats: async () => {
    set({ statsLoading: true });
    try {
      const stats = await apiClient.getDashboardStats();
      set({ stats, statsLoading: false });
    } catch (error) {
      set({ statsLoading: false });
    }
  },

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  activeTab: 'overview',
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  // Error handling
  error: null,
  setError: (error: string | null) => set({ error }),
}));
