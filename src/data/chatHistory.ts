import type { TutorChatMessage } from '@/types/index'

export const initialChatHistory: Record<string, TutorChatMessage[]> = {
  closures: [
    {
      sender: 'ai',
      text: "Hello! I am active and ready to guide you through JavaScript closures. A closure gives you access to an outer function's scope from an inner function.",
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: "Quick challenge: What do you think this returns?\n\nfunction outer(){ let count = 0; return () => ++count }",
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Closures power private variables, event handlers, React hooks, and many interview questions.',
      timestamp: 'Just now',
    },
  ],

  react: [
    {
      sender: 'ai',
      text: "Welcome to React Optimization! Let's explore useMemo, useCallback, and React.memo.",
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Performance Tip: Use React DevTools Profiler before optimizing.',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Today we will reduce unnecessary renders and improve application performance.',
      timestamp: 'Just now',
    },
  ],

  dsa: [
    {
      sender: 'ai',
      text: "Let's crack some DSA problems. Dynamic Programming, Trees, Graphs, and System Design are on today's agenda.",
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Can you solve Maximum Subarray Sum in O(n)?',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Remember the core patterns: Sliding Window, Two Pointers, DFS/BFS, and DP.',
      timestamp: 'Just now',
    },
  ],

  systemDesign: [
    {
      sender: 'ai',
      text: 'Welcome to System Design. Let’s think like architects.',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'How would you design a URL Shortener like Bitly?',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Focus on scalability, caching, databases, queues, and reliability.',
      timestamp: 'Just now',
    },
  ],

  javascript: [
    {
      sender: 'ai',
      text: 'Ready to master modern JavaScript?',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Can you explain var, let, and const?',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Topics available: Event Loop, Async/Await, Closures, Hoisting, and Prototypes.',
      timestamp: 'Just now',
    },
  ],

  ai: [
    {
      sender: 'ai',
      text: 'Welcome to the AI Engineering Lab.',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Explore Prompt Engineering, RAG, AI Agents, and Vector Databases.',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Challenge: Build a chatbot with memory and contextual awareness.',
      timestamp: 'Just now',
    },
  ],

  cybersecurity: [
    {
      sender: 'ai',
      text: 'Cyber Defense Center activated.',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'What is the difference between Authentication and Authorization?',
      timestamp: 'Just now',
    },
    {
      sender: 'ai',
      text: 'Topics: OWASP Top 10, JWT Security, XSS, SQL Injection, and Secure Coding.',
      timestamp: 'Just now',
    },
  ],
}