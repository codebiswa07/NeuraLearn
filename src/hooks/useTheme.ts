'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useTheme() {
  const { theme, toggleTheme } = useAppStore()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return { theme, toggleTheme, isDark: theme === 'dark' }
}
