'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Code2,
  Trash2,
  Users,
  Plus,
  Clock,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react'

import { Card, StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import {
  getRooms,
  deleteRoom,
  cleanupExpiredRooms,
} from '@/lib/firebase/firestore'
import type { CodingRoom } from '@/types'

export default function CodingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [rooms, setRooms] = useState<CodingRoom[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedRoom, setSelectedRoom] = useState<CodingRoom | null>(null)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  const loadRooms = async () => {
    setLoading(true)

    await cleanupExpiredRooms()
    const data = await getRooms()

    setRooms(data)
    setLoading(false)
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const totalMembers = rooms.reduce(
    (acc, room) => acc + (room.participants?.length ?? 0),
    0
  )

  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    const confirmed = confirm(`Delete "${roomName}" room?`)
    if (!confirmed) return

    await deleteRoom(roomId)
    setRooms((prev) => prev.filter((room) => room.id !== roomId))
  }

  const handleJoinRoom = (room: CodingRoom) => {
    if (room.requiresPin && room.hostId !== user?.uid) {
      setSelectedRoom(room)
      setPin('')
      setPinError('')
      return
    }

    router.push(`/coding/room/${room.id}`)
  }

  const verifyPinAndJoin = () => {
    if (!selectedRoom) return

    if (pin.trim() !== selectedRoom.authPin) {
      setPinError('Invalid PIN. Please enter the correct 8-digit PIN.')
      return
    }

    router.push(`/coding/room/${selectedRoom.id}`)
  }

  const closePinModal = () => {
    setSelectedRoom(null)
    setPin('')
    setPinError('')
  }

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

        <Link href="/coding/room">
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
          label="Private Rooms"
          value={rooms.filter((room) => room.requiresPin).length}
          change="PIN protected"
          changeType="neutral"
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
                  Create your first coding room.
                </p>

                <Link href="/coding/room">
                  <Button variant="primary" size="sm" className="mt-4">
                    <Plus className="w-4 h-4" />
                    Create Room
                  </Button>
                </Link>
              </Card>
            )}

            {!loading &&
              rooms.map((room) => (
                <Card key={room.id} hover className="p-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleJoinRoom(room)}
                      className="flex flex-1 items-center gap-4 min-w-0 text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-5 h-5 text-brand-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {room.name}
                          </p>

                          <Badge variant="green">Live</Badge>

                          {room.requiresPin && (
                            <Badge variant="blue">PIN</Badge>
                          )}

                          {room.hostId === user?.uid && (
                            <Badge variant="slate">Owner</Badge>
                          )}
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
                            {room.durationType === 'permanent'
                              ? 'Permanent'
                              : room.durationValue ?? 'Timed'}
                          </span>
                        </div>

                        {room.hostId === user?.uid && room.authPin && (
                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant="blue">PIN: {room.authPin}</Badge>
                          </div>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {room.hostId === user?.uid && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteRoom(room.id, room.name)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                          title="Delete room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleJoinRoom(room)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
                        title="Open room"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Quick Actions
          </h2>

          <Card className="p-4 space-y-3">
            <Link href="/coding/room">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Create New Room
                  </p>
                  <p className="text-xs text-slate-500">
                    Public or private with 8-digit PIN
                  </p>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() =>
                rooms[0] ? handleJoinRoom(rooms[0]) : router.push('/coding/room')
              }
              className="w-full text-left"
            >
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
            </button>

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

      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enter Private Room PIN
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedRoom.name} is protected by an 8-digit PIN.
                </p>
              </div>

              <button
                type="button"
                onClick={closePinModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, 8))
                setPinError('')
              }}
              placeholder="Enter 8-digit PIN"
              maxLength={8}
              className="tracking-[0.35em]"
            />

            {pinError && (
              <p className="mt-2 text-xs text-red-500">{pinError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={closePinModal}>
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={verifyPinAndJoin}
                disabled={pin.length !== 8}
              >
                Join Room
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}