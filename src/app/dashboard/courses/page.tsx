'use client'
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getCourses } from '@/lib/firebase/firestore'
import { CourseCard } from '@/components/course/CourseCard'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { Course, CourseLevel } from '@/types'

const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

export default function CoursesPage() {
  const [courses, setCourses]   = useState<Course[]>([])
  const [search, setSearch]     = useState('')
  const [level, setLevel]       = useState<CourseLevel | 'all'>('all')
  const [loading, setLoading]   = useState(true)

  useEffect(() => { getCourses().then(d => { setCourses(d); setLoading(false) }) }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel  = level === 'all' || c.level === level
    return matchSearch && matchLevel
  })

  return (
    <div className="p-6 max-w-[1200px] animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Course Library</h1>
          <p className="text-sm text-slate-500 mt-1">{courses.length} courses available</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['all', ...LEVELS] as const).map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  level === l ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 max-w-sm">
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses…" icon={<Search className="w-4 h-4" />} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_,i)=><div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => <CourseCard key={c.id} course={c} />)}
          {filtered.length === 0 && (
            <div className="col-span-3 py-20 text-center text-slate-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm">No courses matched your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
