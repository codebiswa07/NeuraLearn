'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftToLine,
  Code2,
  Globe,
  Lock,
  Plus,
  Users,
} from 'lucide-react'

import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import {
  createRoom,
  getRooms,
  cleanupExpiredRooms,
  calculateRoomExpiry,
} from '@/lib/firebase/firestore'
import type { CodingRoom } from '@/types'

export default function CreateRoomPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [rooms, setRooms] = useState<CodingRoom[]>([])
  const [roomName, setRoomName] = useState('')
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public')
  const [durationType, setDurationType] = useState<'permanent' | 'timed'>(
    'permanent'
  )
  const [durationValue, setDurationValue] = useState('01.00.00')
  const [creating, setCreating] = useState(false)

  const [joinRoomId, setJoinRoomId] = useState('')
  const [joinPin, setJoinPin] = useState('')

  const loadRooms = async () => {
    await cleanupExpiredRooms()
    const data = await getRooms()
    setRooms(data)
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const createPersonalRoom = async () => {
    if (!roomName.trim() || creating) return

    setCreating(true)

    try {
      const generatedId =
        roomName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `room-${Date.now()}`

      const isPrivate = visibility === 'Private'
      const authPin = isPrivate
        ? Math.floor(10000000 + Math.random() * 90000000).toString()
        : undefined

      const expiresAt = calculateRoomExpiry(durationType, durationValue)

      const room: Partial<CodingRoom> = {
        id: generatedId,
        name: roomName.trim(),
        hostId: user?.uid ?? 'guest',

        language: 'typescript',
        isPublic: !isPrivate,
        requiresPin: isPrivate,
        authPin,

        inviteCode: `NL-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`,

        roomType: 'student',
        chatMode: 'open',
        isOfficial: false,

        durationType,
        durationValue: durationType === 'permanent' ? 'Permanent' : durationValue,
        expiresAt,

        participants: [],
        files: [
          {
            id: 'main',
            name: 'main.ts',
            language: 'typescript',
            content: `console.log("Welcome to ${roomName.trim()}")`,
            updatedAt: new Date(),

            ownerId: user?.uid ?? 'guest',
            ownerName: user?.displayName ?? 'Room Host',
            visibility: 'host_public',
            isVisible: true,
            sharedWith: [],
          },
        ],
        activeFileId: 'main',
      }

      await createRoom(room)

      router.push(`/coding/room/${generatedId}`)
    } finally {
      setCreating(false)
    }
  }

  const joinRoom = () => {
    const room = rooms.find((item) => item.id === joinRoomId.trim())

    if (!room) {
      alert('Room not found')
      return
    }

    if (room.requiresPin && room.authPin !== joinPin.trim()) {
      alert('Invalid private room PIN')
      return
    }

    router.push(`/coding/room/${room.id}`)
  }

  const totalMembers = rooms.reduce(
    (total, room) => total + (room.participants?.length ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-[1200px] animate-fade-in">
        <div className="mb-6 flex items-start gap-4">
          <Link
            href="/coding"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <ArrowLeftToLine className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Coding Room
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create public/private rooms or join a private room using an
              8-digit PIN.
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Total Rooms"
            value={rooms.length}
            change="Available now"
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
            label="Your Role"
            value={user?.role ?? 'student'}
            change="Room access"
            changeType="neutral"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              New Personal Room
            </h2>

            <Card className="space-y-5 p-5">
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Room Name
                </label>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Example: React Study Room"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(e.target.value as 'Public' | 'Private')
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500">
                    Room Duration
                  </label>
                  <select
                    value={durationType}
                    onChange={(e) =>
                      setDurationType(e.target.value as 'permanent' | 'timed')
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="permanent">Permanent</option>
                    <option value="timed">Auto Delete</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Duration Value
                </label>
                <Input
                  value={durationValue}
                  disabled={durationType === 'permanent'}
                  onChange={(e) => setDurationValue(e.target.value)}
                  placeholder="HH.MM.SS or DD/MM:HH.MM.SS"
                  className="mt-2"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Example: 01.00.00 = 1 hour, 01/00:02.30.00 = 1 day 2h 30m
                </p>
              </div>

              {visibility === 'Private' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                  A private room will automatically generate an 8-digit PIN.
                  Share that PIN only with people you want to invite.
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                onClick={createPersonalRoom}
                disabled={creating || !roomName.trim()}
              >
                <Plus className="h-4 w-4" />
                {creating ? 'Creating...' : 'Create Room'}
              </Button>
            </Card>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Join Room
            </h2>

            <Card className="space-y-4 p-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Room ID
                </label>
                <Input
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="example-room-id"
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Private PIN
                </label>
                <Input
                  value={joinPin}
                  onChange={(e) => setJoinPin(e.target.value)}
                  placeholder="8-digit PIN if private"
                  maxLength={8}
                  className="mt-2"
                />
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={joinRoom}
                disabled={!joinRoomId.trim()}
              >
                <Code2 className="h-4 w-4" />
                Join Room
              </Button>
            </Card>

            <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-900 dark:text-white">
              Recent Rooms
            </h2>

            <Card className="space-y-3 p-4">
              {rooms.slice(0, 4).map((room) => (
                <div
                  key={room.id}
                  className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {room.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {room.language ?? 'typescript'}
                      </p>
                    </div>

                    {room.isPublic ? (
                      <Globe className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {room.participants?.length ?? 0} joined
                    </span>

                    {room.hostId === user?.uid && room.authPin && (
                      <Badge variant="blue">PIN: {room.authPin}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}