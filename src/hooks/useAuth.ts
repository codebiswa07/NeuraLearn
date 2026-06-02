'use client'
import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, getUserProfile } from '@/lib/firebase/auth'
import { useAppStore } from '@/store/useAppStore'

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, setUser } = useAppStore()

  useEffect(() => {
    const unsub = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [setUser])

  return { user, firebaseUser, loading, isAuthenticated: !!firebaseUser }
}
