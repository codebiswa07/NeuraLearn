'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { registerWithEmail } from '@/lib/firebase/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pass.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await registerWithEmail(email, pass, name)
      toast.success('Account created! Welcome to NeuraLearn 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-700 to-teal-800 flex items-center justify-center mx-auto mb-4">
            <img src="/logo/Neuralearn.png" alt="NeuraLearn" className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Join NeuraLearn for free</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Jordan Davis" required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Min 6 characters" required />
            <Button variant="primary" fullWidth loading={loading} type="submit">Create Account</Button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account? <Link href="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
