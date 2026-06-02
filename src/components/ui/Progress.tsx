import { cn } from '@/utils/cn'
interface ProgressProps { value: number; max?: number; size?: 'sm' | 'md'; color?: string; className?: string }
export function Progress({ value, max = 100, size = 'sm', color, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', color ?? (pct > 80 ? 'bg-green-500' : 'bg-brand-600'))}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
