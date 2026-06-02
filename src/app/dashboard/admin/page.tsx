'use client'
import Link from 'next/link'
import { RoleGuard } from '@/features/auth/RoleGuard'
import { StatCard, Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCourses } from '@/lib/firebase/firestore'
import { CoursePerformanceChart } from '@/components/charts/Courseperformance'
import type { Course } from '@/types'
import { Button } from '@/components/ui/Button'

const RECENT_ACTIVITY = [
  { emoji: '🎓', text: 'Jordan D. completed System Design Ch. 8', time: '2m ago' },
  { emoji: '⚡', text: 'New collab session started — Room #43', time: '5m ago' },
  { emoji: '📝', text: 'Ananya S. scored 96% on React Quiz', time: '12m ago' },
  { emoji: '🤖', text: 'AI Tutor had 48 conversations today', time: '1h ago' },
  { emoji: '🏆', text: 'Priya L. earned TypeScript certificate', time: '3h ago' },
]

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    getCourses().then(setCourses)
  }, [])

  return (
    <RoleGuard allow={['admin', 'instructor']}>
      <div className="p-6 max-w-[1200px] animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-slate-500">NeuraLearn Platform Management</p>
          </div>
          <Button variant="primary">
            <Link href="/dashboard/admin/course">
              <Plus className="w-4 h-4" /> Create Course
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Students" value="1,248" change="↑ 84 this week" changeType="up" />
          <StatCard label="Active Courses" value="24" change="↑ 3 this month" changeType="up" />
          <StatCard label="Completion Rate" value="71%" change="↑ 4% vs last" changeType="up" />
          <StatCard label="Lab Sessions" value="342" change="↑ 28 today" changeType="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Course Performance</h2>
              <Badge variant="blue"><TrendingUp className="w-3 h-3 inline mr-1" />Live</Badge>
            </div>
            <div className="p-4 text-sm text-slate-500 text-center py-10">
              <CoursePerformanceChart courses={courses} />
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <div>
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  <span className="text-lg">{a.emoji}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{a.text}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </RoleGuard>
  )
}
