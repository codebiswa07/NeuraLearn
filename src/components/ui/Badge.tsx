import { cn } from '@/utils/cn'
const variants = {
  blue:    'bg-blue-50  dark:bg-blue-950  text-blue-700  dark:text-blue-300',
  green:   'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300',
  amber:   'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
  red:     'bg-red-50   dark:bg-red-950   text-red-700   dark:text-red-300',
  purple:  'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  teal:    'bg-teal-50  dark:bg-teal-950  text-teal-700  dark:text-teal-300',
  slate:   'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
}
interface BadgeProps { variant?: keyof typeof variants; children: React.ReactNode; className?: string; dot?: boolean }
export function Badge({ variant = 'slate', children, className, dot }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'green' ? 'bg-green-500' : 'bg-current')} />}
      {children}
    </span>
  )
}
