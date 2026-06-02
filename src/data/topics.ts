import type { TopicDetail } from '@/types/index'

export const topics: Record<string, TopicDetail> = {
  closures: {
    id: 'closures',
    name: 'JavaScript closures',
    progress: 67,
    badge: 'JS Wizard',
    difficulty: 'Intermediate',
    codeTemplate: `function createCounter() {
  let count = 0;

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    }
  };
}

const counter = createCounter();

console.log("First increment:", counter.increment());
console.log("Second increment:", counter.increment());`,
    aiExplanation:
      "A closure is formed when a nested function retains access to its lexical scope even after the outer function has finished executing. In this template, 'count' is private state preserved by the closure!",
    consoleOutput: [
      '✓ Scope resolution completed.',
      '▶ Outputs:',
      '   First increment: 1',
      '   Second increment: 2',
      '🎉 Closure state isolated successfully.',
    ],
  },

  react: {
    id: 'react',
    name: 'React optimization',
    progress: 85,
    badge: 'Performance Guru',
    difficulty: 'Advanced',
    codeTemplate: `// React.memo & useCallback demonstration
import React, { useCallback } from 'react';

const ExpensiveComponent = React.memo(({ onClick }) => {
  console.log("Expensive component rendered!");
  return <button onClick={onClick}>Click Me</button>;
});

const handleClick = useCallback(() => {
  console.log("Action triggered safely!");
}, []);`,
    aiExplanation:
      'By wrapping child components with React.memo and caching callbacks with useCallback, you prevent unnecessary re-renders of heavy children when parent state updates.',
    consoleOutput: [
      '✓ Virtual DOM validation passed.',
      '▶ Outputs:',
      '   Expensive component rendered! (Initial render only)',
      '   Parent re-rendered, callback reference maintained successfully.',
      '🎉 Render cycle skipped for memoized component.',
    ],
  },

  dsa: {
    id: 'dsa',
    name: 'DSA problems',
    progress: 42,
    badge: 'Algorithmic Master',
    difficulty: 'Advanced',
    codeTemplate: `// Binary Search Algorithm - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

const array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

console.log("Found 23 at index:", binarySearch(array, 23));`,
    aiExplanation:
      'Binary search works by continuously dividing your sorted search interval in half. This reduces time complexity from O(n) linear search to O(log n).',
    consoleOutput: [
      '✓ Arrays verified sorted.',
      '▶ Outputs:',
      '   Target 23 calculated at index: 5',
      '🎉 O(log n) performance verified in 3 comparison steps.',
    ],
  },
}