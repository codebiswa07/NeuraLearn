'use client'
import { useState } from 'react'
import { Search, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/firebase/auth'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { NotificationDropdown } from '../ui/Notification'
import { cn } from '@/utils/cn'

export function Topbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [showUser, setShowUser] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <header className="h-14 flex items-center px-5 gap-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-xs flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-[34px]">
        <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search courses, topics..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 min-w-0"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User */}
        <div className="relative">
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Avatar name={user?.displayName ?? 'User'} uid={user?.uid} photoURL={user?.photoURL} size="sm" />
          </button>
          {showUser && (
            <div className="absolute right-0 top-10 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-card-lg z-50 p-2 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button onClick={() => { signOut(); setShowUser(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
