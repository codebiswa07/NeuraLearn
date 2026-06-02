'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '../../utils/cn'

// Setup standard type definitions for Shadcn chart tokens
type CombinedConfig = {
  label?: React.ReactNode
  icon?: React.ComponentType
} & (
  | { color?: string; theme?: never }
  | { color?: never; theme: Record<string, string> }
)

export type ChartConfig = Record<string, CombinedConfig>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
  }
>(({ id, className, config, children, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot]:stroke-background [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[role=menuitem]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/20 [&_.recharts-reference-line_[role=menuitem]]:stroke-border [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'ChartContainer'

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorStyles = Object.entries(config)
    .map(([key, value]) => {
      if (!value.color) return null
      return `
        [data-chart="${id}"] {
          --color-${key}: ${value.color};
        }
      `
    })
    .filter(Boolean)

  if (!colorStyles.length) return null

  return (
    <style dangerouslySetInnerHTML={{ __html: colorStyles.join('\n') }} />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    active?: boolean
    payload?: Array<{
      name?: string
      value?: number | string
      color?: string
      nameKey?: string
    }>
    label?: React.ReactNode
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      className,
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = 'dot',
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs shadow-xl dark:border-slate-800 dark:bg-slate-950',
          className
        )}
      >
        {!hideLabel && (
          <div className="font-medium text-slate-900 dark:text-slate-50">{label}</div>
        )}
        <div className="grid gap-1">
          {payload.map((item, index) => {
            const dataKey = item.nameKey || item.name || 'value'
            const itemConfig = config[dataKey as keyof typeof config]

            return (
              <div
                key={index}
                className="flex w-full items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      'shrink-0 rounded-[2px]',
                      indicator === 'dot' && 'h-2.5 w-2.5',
                      indicator === 'dashed' && 'w-0.5 border-r border-dashed bg-transparent',
                      indicator === 'line' && 'w-0.5'
                    )}
                    style={
                      {
                        backgroundColor: indicator !== 'dashed' ? item.color : undefined,
                        borderColor: indicator === 'dashed' ? item.color : undefined,
                        height: indicator === 'dashed' ? '12px' : undefined,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div className="flex flex-1 justify-between gap-4 leading-none">
                  <div className="grid gap-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      {itemConfig?.label || item.name}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-50">
                    {item.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = 'ChartTooltip'

export { ChartContainer, ChartTooltip, ChartTooltipContent }