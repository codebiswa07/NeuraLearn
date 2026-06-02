'use client'

import Link from 'next/link'
import { Users, Clock, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import type { Course } from '@/types'

const levelColor: Record<string, 'green' | 'amber' | 'red'> = {
  beginner: 'green',
  intermediate: 'amber',
  advanced: 'red',
}

interface CourseCardProps {
  course: Course
  progress?: number
}

export function CourseCard({ course, progress }: CourseCardProps) {
  const tags = course.tags ?? []
  const modules = course.modules ?? []
  const enrolledCount = course.enrolledCount ?? 0
  const durationHours = course.durationHours ?? 0

  return (
    <Link href={`/courses/${course.id}`}>
      <Card hover className="overflow-hidden h-full flex flex-col">
        <div className="h-28 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center text-4xl">
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

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={levelColor[course.level?.toLowerCase()] ?? 'slate'}>
              {course.level ?? 'Course'}
            </Badge>

            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="slate">
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug mb-2 flex-1">
            {course.title ?? 'Untitled Course'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
            {course.description ?? 'No description available.'}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {enrolledCount.toLocaleString()}
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {durationHours}h
            </span>

            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {modules.length} modules
            </span>
          </div>

          {progress !== undefined && (
            <div className="mt-auto">
              <Progress value={progress} />
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}