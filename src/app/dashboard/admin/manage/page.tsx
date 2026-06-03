'use client'

import { useEffect, useState } from 'react'
import {
  Shield,
  Users,
  Search,
  Crown,
  GraduationCap,
  Save,
} from 'lucide-react'

import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { getUsers, updateUserRolePermissions } from '@/lib/firebase/firestore'
import type { NLUser } from '@/types'

type UserRole = 'student' | 'admin' | 'instructor'

type UserPermissions = {
  canCreateRoom: boolean
  canCreatePrivateRoom: boolean
  canDeleteOwnRoom: boolean
  canChat: boolean
  canUseAI: boolean
  canShareFiles: boolean
  canRequestEdit: boolean
}

type ManagedUser = NLUser & {
  role: UserRole
  permissions?: UserPermissions
}

const defaultPermissions: UserPermissions = {
  canCreateRoom: true,
  canCreatePrivateRoom: true,
  canDeleteOwnRoom: true,
  canChat: true,
  canUseAI: true,
  canShareFiles: true,
  canRequestEdit: true,
}

export default function AdminManagePage() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [search, setSearch] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(
        data.map((user) => ({
          ...user,
          role: (user.role ?? 'student') as UserRole,
          permissions: {
            ...defaultPermissions,
            ...(user.permissions ?? {}),
          },
        }))
      )
    })
  }, [])

  const filteredUsers = users.filter((user) => {
    const value = `${user.displayName ?? ''} ${user.email ?? ''}`.toLowerCase()
    return value.includes(search.toLowerCase())
  })

  const updateLocalRole = (uid: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.uid === uid
          ? {
              ...user,
              role,
            }
          : user
      )
    )
  }

  const togglePermission = (
    uid: string,
    key: keyof UserPermissions
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.uid === uid
          ? {
              ...user,
              permissions: {
                ...defaultPermissions,
                ...(user.permissions ?? {}),
                [key]: !(
                  user.permissions?.[key] ?? defaultPermissions[key]
                ),
              },
            }
          : user
      )
    )
  }

  const saveUser = async (user: ManagedUser) => {
    setSavingId(user.uid)

    await updateUserRolePermissions(user.uid, {
      role: user.role,
      permissions: {
        ...defaultPermissions,
        ...(user.permissions ?? {}),
      },
    })

    setSavingId(null)
  }

  const adminCount = users.filter((user) => user.role === 'admin').length
  const studentCount = users.filter((user) => user.role === 'student').length
  const instructorCount = users.filter(
    (user) => user.role === 'instructor'
  ).length

  return (
    <div className="p-6 max-w-[1200px] animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Manage Users
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user roles and coding-room permissions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Users"
          value={users.length}
          change="Registered accounts"
          changeType="neutral"
        />
        <StatCard
          label="Admins"
          value={adminCount}
          change="Full control"
          changeType="up"
        />
        <StatCard
          label="Instructors"
          value={instructorCount}
          change="Course managers"
          changeType="neutral"
        />
        <StatCard
          label="Students"
          value={studentCount}
          change="Learners"
          changeType="neutral"
        />
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="border-0 bg-transparent focus:ring-0"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.uid} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Crown className="w-5 h-5 text-brand-600" />
                    ) : user.role === 'instructor' ? (
                      <Shield className="w-5 h-5 text-brand-600" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-brand-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user.displayName ?? 'Unnamed User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge
                    variant={
                      user.role === 'admin'
                        ? 'blue'
                        : user.role === 'instructor'
                        ? 'green'
                        : 'slate'
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500">
                    Role
                  </label>

                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateLocalRole(user.uid, e.target.value as UserRole)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => saveUser(user)}
                    disabled={savingId === user.uid}
                  >
                    <Save className="w-4 h-4" />
                    {savingId === user.uid ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(user.permissions ?? defaultPermissions).map(
                ([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      togglePermission(
                        user.uid,
                        key as keyof UserPermissions
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                      value
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="mt-1">{value ? 'Allowed' : 'Blocked'}</p>
                  </button>
                )
              )}
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No users found
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}