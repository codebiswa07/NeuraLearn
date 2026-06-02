import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input
        ref={ref}
        className={cn(
          'w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg',
          'px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all',
          error && 'border-red-400 focus:ring-red-500/20',
          icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
))
Input.displayName = 'Input'
