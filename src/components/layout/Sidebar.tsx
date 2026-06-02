'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { useAppStore } from '@/store/useAppStore'
import {
  LayoutDashboard, BookOpen, Code2, HelpCircle, MessageSquare,
  BarChart2, Award, Settings, Users, ChevronLeft, ChevronRight, Zap
} from 'lucide-react'

const navItems = [
  { group: 'Main',    items: [
    { href: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/courses',        icon: BookOpen,        label: 'Courses' },
    { href: '/coding/room/new',         icon: Code2,           label: 'Coding Lab', badge: 'Live' },
    { href: '/dashboard/quiz/new',           icon: HelpCircle,      label: 'Quizzes' },
    { href: '/dashboard/ai-tutor',       icon: MessageSquare,   label: 'AI Tutor' },
  ]},
  { group: 'Track',   items: [
    { href: '/dashboard/progress',       icon: BarChart2,       label: 'Progress' },
    { href: '/dashboard/certificates',   icon: Award,           label: 'Certificates' },
  ]},
  { group: 'Manage',  items: [
    { href: '/dashboard/admin',          icon: Users,           label: 'Admin' },
    { href: '/dashboard/settings',       icon: Settings,        label: 'Settings' },
  ]},
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800',
      'transition-all duration-250 flex-shrink-0 z-20',
      sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-red-500 dark:border-indigo-800 gap-2.5 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-700 to-teal-800 flex items-center justify-center flex-shrink-0">
          <img src="/logo/Neuralearn.png" alt="NeuraLearn" className="w-6 h-6" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-[15px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
            Neura<span className="text-brand-600">Learn</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(({ group, items }) => (
          <div key={group}>
            {!sidebarCollapsed && (
              <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.8px]">{group}</div>
            )}
            {items.map(({ href, icon: Icon, label, badge }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} className={cn(
                  'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150',
                  'whitespace-nowrap overflow-hidden',
                  active
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
                  sidebarCollapsed && 'justify-center px-2'
                )}>
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{badge}</span>}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="m-2 p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-all flex items-center justify-center"
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
