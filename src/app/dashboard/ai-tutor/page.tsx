import { AITutor } from '@/components/ai/AITutor'

export const metadata = { title: 'AI Tutor' }

export default function AITutorPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="p-5 pb-0 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Tutor</h1>
        <p className="text-sm text-slate-500 mt-0.5">Powered by Claude · Ask anything about your courses, code, or learning path</p>
      </div>
      <div className="flex-1 overflow-hidden p-5 pt-4">
        <AITutor />
      </div>
    </div>
  )
}
