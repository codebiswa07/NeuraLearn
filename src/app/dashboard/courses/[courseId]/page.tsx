'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Clock,
  Users,
  BookOpen,
  Star,
  PlayCircle,
  CheckCircle,
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { getCourseById } from '@/lib/firebase/firestore'
import type { Course } from '@/types'

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(courseId)
        setCourse(data)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Course Not Found
          </h1>
          <p className="text-slate-500">
            This course doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const modules = course.modules ?? []
  const tags = course.tags ?? []

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-0">
          <div className="h-72 lg:h-full bg-gradient-to-br from-brand-100 to-indigo-100 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center text-8xl">
            {course.thumbnailUrl || '📚'}
          </div>

          <div className="lg:col-span-2 p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="green">
                {course.level ?? 'Beginner'}
              </Badge>

              {tags.map(tag => (
                <Badge key={tag} variant="slate">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {course.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Students
                </p>
                <p className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {(course.enrolledCount ?? 0).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Duration
                </p>
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.durationHours ?? 0}h
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Modules
                </p>
                <p className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {modules.length}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Rating
                </p>
                <p className="font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {course.rating ?? 'New'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="primary">
                Enroll Now
              </Button>

              <Button variant="secondary">
                Preview Course
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">
            Your Progress
          </h2>
          <span className="text-sm text-slate-500">
            35%
          </span>
        </div>

        <Progress value={35} />
      </Card>

      {/* Curriculum */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-5">
          Course Curriculum
        </h2>

        <div className="space-y-3">
          {modules.length > 0 ? (
            modules.map((module: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-brand-600" />

                  <div>
                    <p className="font-medium">
                      {module.title || `Module ${index + 1}`}
                    </p>

                    <p className="text-sm text-slate-500">
                      {module.lessons?.length ?? 0} lessons
                    </p>
                  </div>
                </div>

                <CheckCircle className="w-5 h-5 text-slate-300" />
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              No modules added yet.
            </div>
          )}
        </div>
      </Card>

      {/* Instructor */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Instructor
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {(course.instructorId ?? 'N')[0]}
          </div>

          <div>
            <h3 className="font-semibold">
              {course.instructorId ?? 'NeuraLearn Instructor'}
            </h3>

            <p className="text-sm text-slate-500">
              Expert educator and industry practitioner.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}