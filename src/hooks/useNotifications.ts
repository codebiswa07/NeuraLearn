'use client'
import { useEffect } from 'react'
import { subscribeNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/firebase/firestore'
import { useAppStore } from '@/store/useAppStore'

export function useNotifications(userId: string) {
  const { notifications, setNotifications, markNotifRead, markAllNotifsRead } = useAppStore()

  useEffect(() => {
    if (!userId) return
    return subscribeNotifications(userId, setNotifications)
  }, [userId, setNotifications])

  const markRead = async (id: string) => {
    markNotifRead(id)
    await markNotificationRead(userId, id)
  }

  const markAll = async () => {
    markAllNotifsRead()
    await markAllNotificationsRead(userId)
  }

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markRead,
    markAll,
  }
}
