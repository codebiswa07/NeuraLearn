'use client'

import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Card } from '@/components/ui/Card'

export default function NotificationsPage() {
  const { user } = useAuth()

  const {
    notifications,
    markRead,
    markAll,
    unreadCount,
  } = useNotifications(user?.uid ?? '')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>

          <p className="text-slate-500">
            {unreadCount} unread notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAll}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm"
          >
            Mark All Read
          </button>
        )}
      </div>

      <Card className="overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No notifications
            </h3>
            <p className="text-slate-500 mt-1">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markRead(notification.id)}
              className={`w-full text-left p-5 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                !notification.read
                  ? 'bg-blue-50/50 dark:bg-blue-950/20'
                  : ''
              }`}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {notification.title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {notification.message}
              </p>
            </button>
          ))
        )}
      </Card>
    </div>
  )
}