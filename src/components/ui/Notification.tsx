'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/utils/cn'

export function NotificationDropdown() {
    const { user } = useAuth()

    const {
        notifications,
        unreadCount,
        markRead,
        markAll,
    } = useNotifications(user?.uid ?? '')

    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all"
            >
                <Bell className="w-4 h-4" />

                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-11 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Notifications
                            </h3>

                            <p className="text-xs text-slate-500">
                                {unreadCount} unread
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAll}
                                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-3xl mb-2">🔔</div>

                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    No notifications
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    You're all caught up.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => markRead(notification.id)}
                                    className={cn(
                                        'w-full text-left p-4 border-b border-slate-100 dark:border-slate-800 transition',
                                        'hover:bg-slate-50 dark:hover:bg-slate-800/60',
                                        !notification.read &&
                                        'bg-blue-50/50 dark:bg-blue-950/20'
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            {!notification.read ? (
                                                <div className="w-2 h-2 bg-brand-600 rounded-full" />
                                            ) : (
                                                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                                {notification.title}
                                            </h4>

                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {notification.message}
                                            </p>

                                            <p className="text-[11px] text-slate-400 mt-2">
                                                {notification.createdAt
                                                    ? new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()
                                                    : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <Link
                            href="/dashboard/notifications"
                            className="block w-full text-center text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}