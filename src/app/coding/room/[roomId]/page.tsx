'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftToLine } from 'lucide-react'

import { CollabEditor } from '@/components/coding/CollabEditor'
import { RoomChat } from '@/components/coding/RoomChat'
import { UserPresence } from '@/components/coding/UserPresence'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/Badge'
import type { CodingRoom } from '@/types'

const MOCK_ROOM: CodingRoom = {
  id: 'demo',
  name: 'Session #42',
  hostId: 'user1',
  participants: [
    {
      uid: 'user1',
      displayName: 'Jordan D.',
      avatarColor: '#2563eb',
      role: 'host',
      isOnline: true,
      joinedAt: new Date(),
    },
    {
      uid: 'user2',
      displayName: 'Ananya S.',
      avatarColor: '#0d9488',
      role: 'participant',
      isOnline: true,
      joinedAt: new Date(),
    },
    {
      uid: 'user3',
      displayName: 'Raj K.',
      avatarColor: '#d97706',
      role: 'participant',
      isOnline: true,
      joinedAt: new Date(),
    },
    {
      uid: 'user4',
      displayName: 'Priya L.',
      avatarColor: '#7c3aed',
      role: 'participant',
      isOnline: false,
      joinedAt: new Date(),
    },
  ],
  files: [
    {
      id: 'f1',
      name: 'session.ts',
      language: 'typescript',
      content: `import { useState, useEffect } from 'react'

interface User {
  uid: string
  name: string
}

interface CollabSession {
  roomId: string
  users: User[]
  content: string
}

const CodingLab = (session: CollabSession) => {
  const [code, setCode] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const socket = connectRoom(session.roomId)

    socket.on('code-update', setCode)
    socket.on('user-join', (user) => {
      setUsers((prev) => [...prev, user])
    })

    return () => socket.disconnect()
  }, [session.roomId])

  return null
}`,
      updatedAt: new Date(),
    },
    {
      id: 'f2',
      name: 'types.ts',
      language: 'typescript',
      content: `export interface User {
  uid: string
  name: string
}`,
      updatedAt: new Date(),
    },
  ],
  activeFileId: 'f1',
  language: 'typescript',
  isPublic: true,
  inviteCode: 'NL-42-XYZ',
  createdAt: new Date(),
}

export default function RoomPage() {
  const params = useParams<{ roomId: string }>()
  const roomId = params.roomId

  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'chat' | 'ai'>('chat')

  const uid = user?.uid ?? 'guest'

  const room: CodingRoom = {
    ...MOCK_ROOM,
    id: roomId || MOCK_ROOM.id,
    name: roomId === 'new' ? 'New Coding Session' : `Room ${roomId}`,
  }

  const messages: any[] = []

  const sendMessage = useCallback(() => {
    // TODO: connect to real room chat
  }, [])

  const handleRun = useCallback((code: string) => {
    console.log('[RoomPage] run code:', code.slice(0, 80))
  }, [])

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden animate-fade-in bg-slate-50 dark:bg-slate-950">
      {/* LEFT SIDEBAR */}
      <aside className="w-[220px] min-w-[220px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col overflow-hidden hidden md:flex">
        <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeftToLine className="w-4 h-4 text-slate-500" />
          </Link>

          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
            {room.name}
          </span>

          <Badge variant="green" dot>
            Live
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto">
          <UserPresence
            participants={room.participants ?? []}
            inviteCode={room.inviteCode ?? ''}
            roomId={room.id}
          />
        </div>
      </aside>

      {/* CENTER EDITOR */}
      <main className="flex-1 min-w-0">
        <CollabEditor
          room={room}
          userId={uid}
          onRun={handleRun}
        />
      </main>

      {/* RIGHT CHAT */}
      <aside className="w-[280px] min-w-[280px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 hidden lg:flex flex-col overflow-hidden">
        <RoomChat
          messages={messages}
          userId={uid}
          onSend={sendMessage}
          activeTab={activeTab}
          onSwitchTab={setActiveTab}
        />
      </aside>
    </div>
  )
}