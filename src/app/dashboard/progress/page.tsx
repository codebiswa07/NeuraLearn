import { Progress } from '@/components/ui/Progress'
import { Card } from '@/components/ui/Card'

export const metadata = { title: 'Progress' }

export default function ProgressPage() {
  const courseProgress = [
    { title: '🌐 Full-Stack Web Development',    pct: 68 },
    { title: '🧩 Data Structures & Algorithms', pct: 34 },
    { title: '🏗️ System Design Mastery',        pct: 91 },
    { title: '📘 TypeScript Deep Dive',          pct: 55 },
    { title: '☁️ Cloud Architecture (AWS)',       pct: 22 },
    { title: '🤖 Machine Learning Fundamentals', pct: 0  },
  ]

  return (
    <div className="p-6 max-w-[900px] animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Learning Progress</h1>
      <p className="text-sm text-slate-500 mb-6">Your detailed learning journey</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Course Completion</h2>
          <div className="space-y-4">
            {courseProgress.map(c => (
              <div key={c.title}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{c.title}</span>
                  <span className={`font-semibold ${c.pct > 80 ? 'text-green-600' : c.pct > 0 ? 'text-brand-600' : 'text-slate-400'}`}>{c.pct}%</span>
                </div>
                <Progress value={c.pct} color={c.pct > 80 ? 'bg-green-500' : c.pct > 0 ? 'bg-brand-600' : 'bg-slate-200'} />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quiz Performance</h2>
            {[['DSA Quiz 1', 78], ['React Fundamentals', 92], ['System Design', 85], ['TypeScript Quiz', 88]].map(([n, s]) => (
              <div key={n} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{n as string}</span>
                <div className="flex items-center gap-3">
                  <Progress value={s as number} className="w-20" color={(s as number) > 85 ? 'bg-green-500' : 'bg-brand-600'} />
                  <span className={`text-xs font-bold ${(s as number) > 85 ? 'text-green-600' : 'text-brand-600'}`}>{s as number}%</span>
                </div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Lab Activity</h2>
            {[['Sessions attended',14],['Code commits',87],['Collab rooms joined',22],['AI tutor queries',56]].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-500">{l}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
