'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Code2, BookOpen, Flame, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getCourses } from '@/lib/firebase/firestore'
import { StatCard, Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { CourseCard } from '@/components/course/CourseCard'
import type { Course } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses().then(data => { setCourses(data); setLoading(false) })
  }, [])

  const enrolled = courses.filter(c => user?.enrolledCourses.includes(c.id))
  const inProgress = enrolled.filter(c => c.id) // In practice filter by progress > 0
  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 5) return 'Working late'
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Burning the midnight oil'
  }
  return (
    <div className="p-6 max-w-[1200px] animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.displayName?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's on your plate today.</p>
        </div>
        <Link href="/coding/room/new">
          <Button variant="primary" size="md">
            <Code2 className="w-4 h-4" /> Open Coding Lab
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Enrolled Courses" value={user?.enrolledCourses.length ?? 6} change="↑ 2 this month" changeType="up" />
        <StatCard label="Hours Learned" value="142" change="↑ 12 this week" changeType="up" />
        <StatCard label="Quiz Score Avg" value="84%" change="↑ 6% vs last" changeType="up" />
        <StatCard label="Day Streak" value={`${user?.streak ?? 21} 🔥`} change="Personal best!" changeType="neutral" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Continue Learning</h2>
            <Link href="/dashboard/courses" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {loading ? Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            )) : courses.slice(0, 3).map(c => (
              <Link key={c.id} href={`/courses/${c.id}`}>
                <Card hover className="flex items-center gap-4 p-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center text-xl flex-shrink-0">
                    {c.thumbnailUrl ?? '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{(c.modules ?? []).length} modules · {c.level ?? 'Beginner'}</p>
                    <Progress value={Math.random() * 80 + 10} className="mt-2" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's schedule */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Today's Schedule</h2>
          <Card className="p-4 space-y-3">
            {[
              { time: '09:00 AM', title: 'React Hooks — Lesson 14', type: 'lesson', color: 'bg-brand-600' },
              { time: '02:00 PM', title: 'Collab Coding Lab · Room 7', type: 'lab', color: 'bg-purple-600' },
              { time: '04:30 PM', title: 'DSA Quiz — Arrays & Trees', type: 'quiz', color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.time} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {item.type === 'lesson' ? <Clock className="w-4 h-4 text-white" /> :
                    item.type === 'lab' ? <Code2 className="w-4 h-4 text-white" /> :
                      <BookOpen className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{item.time}</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{item.title}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
