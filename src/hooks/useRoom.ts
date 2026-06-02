'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { subscribeRoom, subscribeChat, sendChatMessage } from '@/lib/firebase/firestore'
import type { CodingRoom, ChatMessage } from '@/types'

export function useRoom(roomId: string, userId: string) {
  const [room, setRoom] = useState<CodingRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const ydocRef = useRef<Y.Doc | null>(null)
  const providerRef = useRef<WebsocketProvider | null>(null)

  useEffect(() => {
    if (!roomId) return
    const unsubRoom = subscribeRoom(roomId, setRoom)
    const unsubChat = subscribeChat(roomId, setMessages)
    const ydoc = new Y.Doc()
    ydocRef.current = ydoc
    const wsUrl = process.env.NEXT_PUBLIC_YJS_WS_URL || 'ws://localhost:1234'
    const provider = new WebsocketProvider(wsUrl, `neuralearn-${roomId}`, ydoc)
    providerRef.current = provider
    provider.on('status', ({ status }: { status: string }) => setConnected(status === 'connected'))
    return () => { unsubRoom(); unsubChat(); provider.destroy(); ydoc.destroy() }
  }, [roomId])

  const sendMessage = useCallback(async (text: string, type: 'text' | 'code' = 'text') => {
    if (!text.trim()) return
    await sendChatMessage(roomId, { roomId, userId, displayName: userId, text, type, createdAt: new Date() })
  }, [roomId, userId])

  return { room, messages, connected, ydoc: ydocRef.current, sendMessage }
}
