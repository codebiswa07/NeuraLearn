import * as React from 'react'
import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/*                                 CORE CARD                                  */
/* -------------------------------------------------------------------------- */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-950 dark:text-slate-50 shadow-sm',
          hover && 'cursor-pointer transition-all duration-150 hover:shadow-card-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5',
          onClick && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

/* -------------------------------------------------------------------------- */
/*                           SUB-COMPONENTS (NEW)                             */
/* -------------------------------------------------------------------------- */

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-white', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

/* -------------------------------------------------------------------------- */
/*                               STAT CARD (NEW)                              */
/* -------------------------------------------------------------------------- */

interface StatCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
}

function StatCard({ label, value, change, changeType = 'up', className, ...props }: StatCardProps) {
  return (
    <Card className={cn('p-5', className)} {...props}>
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>
      {change && (
        <div
          className={cn('text-xs font-medium mt-1.5', {
            'text-green-600 dark:text-green-400': changeType === 'up',
            'text-red-500 dark:text-red-400': changeType === 'down',
            'text-slate-500 dark:text-slate-400': changeType === 'neutral',
          })}
        >
          {change}
        </div>
      )}
    </Card>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, StatCard }