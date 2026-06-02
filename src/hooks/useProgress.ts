'use client'
import { useEffect, useState } from 'react'
import { subscribeProgress, markLessonComplete } from '@/lib/firebase/firestore'
import type { UserProgress } from '@/types'

export function useProgress(userId: string, courseId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  useEffect(() => {
    if (!userId || !courseId) return
    return subscribeProgress(userId, courseId, setProgress)
  }, [userId, courseId])
  const completeLesson = (lessonId: string) => markLessonComplete(userId, courseId, lessonId)
  return { progress, completeLesson }
}
