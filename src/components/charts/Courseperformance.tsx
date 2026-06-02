'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Chart'
import type { Course } from '@/types'

interface Props {
  courses: Course[]
}

// Centralized configuration using modern Tailwind CSS variables/HSL tokens
const chartConfig = {
  students: {
    label: 'Students',
    color: 'hsl(var(--chart-1, 239 84% 67%))', // Original Indigo #6366f1 fallback
  },
}

export function CoursePerformanceChart({ courses }: Props) {
  // Clean, focused data formatting omitting unused variables
  const data = courses.slice(0, 6).map((course) => ({
    name: course.title?.slice(0, 18) || 'Untitled',
    students: course.enrolledCount ?? 0,
  }))

  return (
    <Card>
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Course Performance
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Students enrolled across your top courses
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-6 h-80">
        {/* ChartContainer handles responsiveness & injects configuration styles */}
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid 
              vertical={false} 
              className="stroke-slate-200 dark:stroke-slate-800" 
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
              className="text-xs fill-slate-500 dark:fill-slate-400"
            />

            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs fill-slate-500 dark:fill-slate-400"
            />

            {/* Semantic Shadcn-style tooltip wrapper */}
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent indicator="dashed" />} 
            />

            <Bar
              dataKey="students"
              fill="var(--color-students)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}