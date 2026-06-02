'use client'
import { cn } from '@/utils/cn'
import type { QuizQuestion as Q } from '@/types'

interface Props { question: Q; selected: number | null; revealed: boolean; onSelect: (i: number) => void }
export function QuizQuestion({ question, selected, revealed, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{question.text}</h2>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect  = revealed && i === question.correctIndex
          const isWrong    = revealed && isSelected && i !== question.correctIndex
          return (
            <button key={i} onClick={() => !revealed && onSelect(i)} className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] text-left transition-all duration-150',
              'text-sm font-medium',
              isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' :
              isWrong   ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' :
              isSelected? 'border-brand-400 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300' :
              'border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-slate-700 dark:text-slate-300',
              !revealed && 'cursor-pointer'
            )}>
              <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-current bg-current' : 'border-current opacity-50')}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="flex-1">{opt}</span>
              {isCorrect && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">Correct</span>}
              {isWrong   && <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">Wrong</span>}
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-100 dark:border-blue-900">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Explanation: </span>
          <span className="text-sm text-slate-700 dark:text-slate-300">{question.explanation}</span>
        </div>
      )}
    </div>
  )
}
