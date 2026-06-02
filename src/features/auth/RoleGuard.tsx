'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

interface RoleGuardProps { children: React.ReactNode; allow: UserRole[]; fallback?: string }
export function RoleGuard({ children, allow, fallback = '/dashboard' }: RoleGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading && user && !allow.includes(user.role)) router.replace(fallback)
  }, [user, loading, allow, fallback, router])
  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user || !allow.includes(user.role)) return null
  return <>{children}</>
}
