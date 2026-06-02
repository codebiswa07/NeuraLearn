'use client'

import { useState } from 'react'
import { PlusCircle, Save } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'

export default function AdminCoursePage() {
  const [loading, setLoading] = useState(false)

  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    thumbnail: '',
    instructor: '',
    duration: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCourse(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const createCourse = async () => {
    try {
      setLoading(true)

      await addDoc(collection(db, 'courses'), {
        ...course,
        enrolledStudents: 0,
        rating: 0,
        lessons: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast.success('Course created successfully')

      setCourse({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        thumbnail: '',
        instructor: '',
        duration: '',
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <PlusCircle className="w-8 h-8 text-brand-600" />
        <div>
          <h1 className="text-3xl font-bold">
            Create Course
          </h1>
          <p className="text-slate-500">
            Add a new course to NeuraLearn
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Course Title
          </label>
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Complete React Mastery"
            className="w-full rounded-xl border px-4 py-3 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            rows={5}
            placeholder="Course description..."
            className="w-full rounded-xl border px-4 py-3 bg-transparent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              name="category"
              value={course.category}
              onChange={handleChange}
              placeholder="Web Development"
              className="w-full rounded-xl border px-4 py-3 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Instructor
            </label>
            <input
              name="instructor"
              value={course.instructor}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border px-4 py-3 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty
            </label>

            <select
              name="level"
              value={course.level}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 bg-transparent"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Duration
            </label>
            <input
              name="duration"
              value={course.duration}
              onChange={handleChange}
              placeholder="12 Hours"
              className="w-full rounded-xl border px-4 py-3 bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail URL
          </label>
          <input
            name="thumbnail"
            value={course.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-xl border px-4 py-3 bg-transparent"
          />
        </div>

        <button
          onClick={createCourse}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </div>
    </div>
  )
}