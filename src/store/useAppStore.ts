import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NLUser, Course, CodingRoom, AIMessage, AppNotification } from '@/types'

interface AppState {
  user: NLUser | null
  setUser: (u: NLUser | null) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  courses: Course[]
  setCourses: (c: Course[]) => void
  activeRoom: CodingRoom | null
  setActiveRoom: (r: CodingRoom | null) => void
  aiHistory: AIMessage[]
  addAIMessage: (m: AIMessage) => void
  clearAIHistory: () => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (v: boolean) => void
  notifications: AppNotification[]
  setNotifications: (n: AppNotification[]) => void
  addNotification: (n: AppNotification) => void
  markNotifRead: (id: string) => void
  markAllNotifsRead: () => void
  unreadCount: () => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      theme: 'light',
      toggleTheme: () => set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', next === 'dark')
        return { theme: next }
      }),

      courses: [],
      setCourses: (courses) => set({ courses }),

      activeRoom: null,
      setActiveRoom: (activeRoom) => set({ activeRoom }),

      aiHistory: [],
      addAIMessage: (msg) => set((s) => ({ aiHistory: [...s.aiHistory, msg] })),
      clearAIHistory: () => set({ aiHistory: [] }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      mobileSidebarOpen: false,
      setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),

      notifications: [],
      setNotifications: (n) => set({ notifications: n }),
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      markNotifRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotifsRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),
      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    {
      name: 'neuralearn-store',
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        aiHistory: s.aiHistory,
      }),
    }
  )
)
