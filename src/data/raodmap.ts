import type { RoadmapLevel } from '@/types'

export const roadmapLevels: RoadmapLevel[] = [
  {
    level: 1,
    title: 'Lexical Closure Bubble',
    description: 'Isolate private variable execution spaces cleanly.',
    progress: 'Completed ✓',
  },
  {
    level: 2,
    title: 'Tree Reconciliation',
    description: 'Cache function pointers using React memory hooks.',
    progress: '85% Complete',
  },
  {
    level: 3,
    title: 'Logarithmic Divide',
    description: 'Master binary indices for extreme performance scaling.',
    progress: '42% Complete',
  },
  {
    level: 4,
    title: 'Advanced Monad Scopes',
    description: 'Control concurrent application state via pure structures.',
    progress: 'Complete Level 3 first',
    locked: true,
  },
]