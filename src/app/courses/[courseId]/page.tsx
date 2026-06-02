'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, Users, BookOpen, Star } from 'lucide-react'
import { getCourse } from '@/lib/firebase/firestore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Course } from '@/types'

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return

    getCourse(courseId)
      .then(setCourse)
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Course not found
          </h1>
          <p className="text-slate-500 mt-2">
            This course does not exist or was removed.
          </p>
        </div>
      </div>
    )
  }

  const modules = course.modules ?? []
  const tags = course.tags ?? []
  const enrolledCount = course.enrolledCount ?? 0
  const durationHours = course.durationHours ?? 0

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-3">
          <div className="h-72 bg-gradient-to-br from-brand-50 to-indigo-100 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center text-7xl">
            {course.thumbnailUrl?.startsWith('http') ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{course.thumbnailUrl || '📚'}</span>
            )}
          </div>

          <div className="lg:col-span-2 p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="green">{course.level ?? 'Beginner'}</Badge>

              {tags.map((tag) => (
                <Badge key={tag} variant="slate">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {course.title ?? 'Untitled Course'}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {course.description ?? 'No description available.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Users className="w-4 h-4" />
                {enrolledCount.toLocaleString()} students
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" />
                {durationHours}h
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <BookOpen className="w-4 h-4" />
                {modules.length} modules
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Star className="w-4 h-4" />
                {course.rating ?? 'New'}
              </div>
            </div>

            <Button variant="primary">
              Enroll Now
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Course Curriculum
        </h2>

        {modules.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No modules added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {modules.map((module: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {module.title ?? `Module ${index + 1}`}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {module.lessons?.length ?? 0} lessons
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}