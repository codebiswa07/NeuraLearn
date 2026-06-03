'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftToLine } from 'lucide-react'

import { CollabEditor } from '@/components/coding/CollabEditor'
import { RoomChat } from '@/components/coding/RoomChat'
import { UserPresence } from '@/components/coding/UserPresence'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/Badge'

import {
  getRoom,
  subscribeRoom,
  subscribeChat,
  sendChatMessage,
  joinRoom,
  leaveRoom,
} from '@/lib/firebase/firestore'

import type { CodingRoom, ChatMessage } from '@/types'

export default function RoomPage() {
  const params = useParams<{ roomId: string }>()
  const roomId = params.roomId

  const { user } = useAuth()

  const [room, setRoom] = useState<CodingRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'ai'>('chat')

  const uid = user?.uid ?? 'guest'

  useEffect(() => {
    if (!roomId) return

    setLoading(true)

    const unsubRoom = subscribeRoom(roomId, (data) => {
      setRoom(data)
      setLoading(false)
    })

    const unsubChat = subscribeChat(roomId, (data) => {
      setMessages(data)
    })

    return () => {
      unsubRoom()
      unsubChat()
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId || !user) return

    joinRoom(roomId, {
      uid: user.uid,
      displayName: user.displayName ?? 'Guest User',
      avatarColor: '#2563eb',
      role: user.role === 'admin' ? 'host' : 'participant',
      isOnline: true,
      joinedAt: new Date(),
    })

    return () => {
      leaveRoom(roomId, user.uid)
    }
  }, [roomId, user])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!room) return

      const isAdminRoom = room.roomType === 'admin'
      const isUserAdmin = user?.role === 'admin'
      const canSendChat =
        room.chatMode === 'open' || (isAdminRoom && isUserAdmin)

      if (!canSendChat) return

      await sendChatMessage(room.id, {
        text,
        userId: uid,
        roomId: room.id,
        type: 'text',
        displayName: user?.displayName ?? 'Guest User',
        createdAt: new Date(),
      })
    },
    [room, uid, user?.displayName, user?.role]
  )

  const handleRun = useCallback((code: string) => {
    console.log('[RoomPage] run code:', code.slice(0, 80))
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
        Loading coding room...
      </div>
    )
  }

  if (!room) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Room not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This coding room does not exist or was not created yet.
        </p>

        <Link
          href="/coding"
          className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:underline"
        >
          Back to Coding Lab
        </Link>
      </div>
    )
  }

  const isAdminRoom = room.roomType === 'admin'
  const isUserAdmin = user?.role === 'admin'
  const canSendChat = room.chatMode === 'open' || (isAdminRoom && isUserAdmin)

  return (
    <div className="grid h-[calc(100vh-56px)] grid-cols-[220px_minmax(0,1fr)_260px] overflow-hidden animate-fade-in bg-slate-50 dark:bg-slate-950">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex min-h-0 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
        <div className="h-14 px-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <Link
            href="/coding"
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

        <div className="flex-1 min-h-0 overflow-y-auto">
          <UserPresence
            participants={room.participants ?? []}
            inviteCode={room.inviteCode ?? ''}
            roomId={room.id}
          />
        </div>
      </aside>

      {/* CENTER EDITOR */}
      <main className="min-w-0 min-h-0 overflow-hidden">
        <CollabEditor room={room} userId={uid} onRun={handleRun} />
      </main>

      {/* RIGHT CHAT */}
      <aside className="hidden lg:flex min-h-0 flex-col bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
        <RoomChat
          messages={messages}
          userId={uid}
          onSend={sendMessage}
          activeTab={activeTab}
          onSwitchTab={setActiveTab}
          canSend={canSendChat}
        />
      </aside>
    </div>
  )
}