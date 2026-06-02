'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Quiz as QuizType } from '@/types'

// Mock quiz — replace with getQuiz(quizId) from Firestore
const MOCK_QUIZ: QuizType = {
  id: 'q1', courseId: 'c1', title: 'DSA Fundamentals',
  description: 'Test your knowledge of Data Structures & Algorithms',
  timeLimitSecs: 600, passingScore: 70, attempts: 3,
  questions: [
    { id: 'q1', text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 1, explanation: 'Binary search halves the search space each step, resulting in O(log n) time complexity.', points: 10, type: 'mcq' },
    { id: 'q2', text: 'Which data structure uses LIFO (Last In, First Out) order?', options: ['Queue', 'Linked List', 'Stack', 'Heap'], correctIndex: 2, explanation: 'A Stack follows LIFO — the last element pushed is the first popped.', points: 10, type: 'mcq' },
    { id: 'q3', text: 'What hook is used for side effects in React?', options: ['useState', 'useRef', 'useEffect', 'useMemo'], correctIndex: 2, explanation: 'useEffect runs after render and handles side effects like API calls, timers, and subscriptions.', points: 10, type: 'mcq' },
    { id: 'q4', text: 'What does "ACID" stand for in databases?', options: ['Atomic, Consistent, Isolated, Durable', 'Access, Control, Integrity, Data', 'Async, Concurrent, Integrated, Distributed', 'Atomic, Cached, Isolated, Dynamic'], correctIndex: 0, explanation: 'ACID ensures database transactions are Atomic, Consistent, Isolated, and Durable.', points: 10, type: 'mcq' },
  ],
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const router = useRouter()
  const quiz = MOCK_QUIZ
  const [qi, setQi]         = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore]   = useState(0)
  const [done, setDone]     = useState(false)
  const [secs, setSecs]     = useState(quiz.timeLimitSecs)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(t); setDone(true) } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [done])

  const check = () => { if (selected !== null) { if (selected === quiz.questions[qi].correctIndex) setScore(s=>s+quiz.questions[qi].points); setRevealed(true) } }
  const next  = () => { if (qi < quiz.questions.length - 1) { setQi(q=>q+1); setSelected(null); setRevealed(false) } else setDone(true) }

  const mins = Math.floor(secs / 60), s = secs % 60

  if (done) return (
    <div className="p-6 max-w-lg mx-auto text-center animate-fade-in">
      <div className="text-5xl mb-4">{score >= quiz.passingScore * quiz.questions.length / 10 ? '🏆' : '📚'}</div>
      <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
      <p className="text-slate-500 mb-6">{quiz.title}</p>
      <Card className="p-6 mb-6">
        <div className="text-4xl font-bold text-brand-600 mb-1">{Math.round((score / (quiz.questions.length * 10)) * 100)}%</div>
        <div className="text-sm text-slate-500">{score} / {quiz.questions.length * 10} points</div>
      </Card>
      <div className="flex gap-3 justify-center">
        <Button variant="primary" onClick={() => { setQi(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); setSecs(quiz.timeLimitSecs) }}>Retry Quiz</Button>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>Dashboard</Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{quiz.title}</h1>
          <p className="text-sm text-slate-500">{quiz.description}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${secs < 60 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
          <Clock className="w-4 h-4" />
          {mins}:{String(s).padStart(2,'0')}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Progress value={qi + (revealed ? 1 : 0)} max={quiz.questions.length} size="md" className="flex-1" />
        <Badge variant="blue">Q {qi+1} / {quiz.questions.length}</Badge>
      </div>

      <Card className="p-6 mb-4">
        <QuizQuestion question={quiz.questions[qi]} selected={selected} revealed={revealed} onSelect={setSelected} />
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => { setQi(q=>Math.max(0,q-1)); setSelected(null); setRevealed(false) }} disabled={qi===0}>← Previous</Button>
        <div className="flex gap-2">
          {!revealed && selected !== null && <Button variant="primary" onClick={check}>Check Answer</Button>}
          {revealed && <Button variant="primary" onClick={next}>{qi < quiz.questions.length-1 ? 'Next →' : 'See Results'}</Button>}
        </div>
      </div>
    </div>
  )
}
