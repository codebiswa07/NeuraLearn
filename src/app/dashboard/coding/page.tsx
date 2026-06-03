'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Code2,
  Users,
  Plus,
  Clock,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { getRooms } from '@/lib/firebase/firestore'
import type { CodingRoom } from '@/types'

export default function CodingPage() {
  const { user } = useAuth()

  const [rooms, setRooms] = useState<CodingRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRooms()
      .then((data) => setRooms(data))
      .finally(() => setLoading(false))
  }, [])

  const totalMembers = rooms.reduce(
    (acc, room) => acc + (room.participants?.length ?? 0),
    0
  )
  

  return (
    <div className="p-6 max-w-[1200px] animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Coding Lab
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a room, join live coding, or create your own practice space.
          </p>
        </div>

        <Link href="/dashboard/admin/room">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Create Room
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Available Rooms"
          value={rooms.length}
          change={loading ? 'Loading rooms' : 'Ready to join'}
          changeType="neutral"
        />

        <StatCard
          label="Live Members"
          value={totalMembers}
          change="Across rooms"
          changeType="up"
        />

        <StatCard
          label="Your Streak"
          value={`${user?.streak ?? 21} 🔥`}
          change="Keep practicing"
          changeType="up"
        />

        <StatCard
          label="AI Help"
          value="On"
          change="Hints available"
          changeType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Choose Coding Room
            </h2>

            <Link
              href="/dashboard/ai-tutor"
              className="text-xs text-brand-600 hover:underline flex items-center gap-1"
            >
              Need help?
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}

            {!loading && rooms.length === 0 && (
              <Card className="p-6 text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-slate-500" />
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  No coding rooms found
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Create your first room from the admin panel.
                </p>

                <Link href="/dashboard/admin/room">
                  <Button variant="primary" size="sm" className="mt-4">
                    <Plus className="w-4 h-4" />
                    Create Room
                  </Button>
                </Link>
              </Card>
            )}

            {!loading &&
              rooms.map((room) => (
                <Link key={room.id} href={`/coding/room/${room.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-5 h-5 text-brand-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {room.name}
                          </p>

                          <Badge variant="green">Live</Badge>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {room.language ?? 'typescript'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.participants?.length ?? 0} members
                          </span>

                          <span className="flex items-center gap-1">
                            {room.isPublic ? (
                              <Globe className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            {room.isPublic ? 'Public' : 'Private'}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Join anytime
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Quick Actions
          </h2>

          <Card className="p-4 space-y-3">
            <Link href="/dashboard/admin/room">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Create New Room
                  </p>
                  <p className="text-xs text-slate-500">
                    Start your own coding session
                  </p>
                </div>
              </div>
            </Link>

            <Link href={rooms[0] ? `/coding/room/${rooms[0].id}` : '/dashboard/admin/room'}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Open Latest Room
                  </p>
                  <p className="text-xs text-slate-500">
                    Continue coding from available rooms
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/ai-tutor">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Ask AI Tutor
                  </p>
                  <p className="text-xs text-slate-500">
                    Get hints while coding
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}