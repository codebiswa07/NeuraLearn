/**
 * RoomService — Socket.io room orchestration
 * Handles: join/leave, code sync, cursor broadcast, presence
 *
 * Architecture:
 *  - Socket.io for presence & cursor events (low-latency signals)
 *  - Y.js CRDT via y-websocket for conflict-free code editing
 *  - Firestore for durable chat + room metadata
 */
import { io, type Socket } from 'socket.io-client'
import type { RoomParticipant } from '@/types'

export interface CursorPosition { userId: string; line: number; column: number; color: string }
export interface RoomEvents {
  onUserJoin:    (p: RoomParticipant) => void
  onUserLeave:   (uid: string) => void
  onCursorMove:  (pos: CursorPosition) => void
  onTyping:      (uid: string, isTyping: boolean) => void
  onCodeRun:     (output: string, error?: string) => void
}

export class RoomService {
  private socket: Socket | null = null
  private roomId: string = ''
  private userId: string = ''

  connect(wsUrl: string, roomId: string, userId: string, events: RoomEvents): void {
    this.roomId = roomId
    this.userId = userId
    this.socket = io(wsUrl, { transports: ['websocket'], auth: { userId } })

    this.socket.on('connect',         () => this.socket?.emit('room:join', { roomId, userId }))
    this.socket.on('room:user_join',  events.onUserJoin)
    this.socket.on('room:user_leave', ({ uid }: { uid: string }) => events.onUserLeave(uid))
    this.socket.on('room:cursor',     events.onCursorMove)
    this.socket.on('room:typing',     ({ uid, typing }: { uid: string; typing: boolean }) => events.onTyping(uid, typing))
    this.socket.on('code:output',     ({ output, error }: { output: string; error?: string }) => events.onCodeRun(output, error))
  }

  sendCursor(line: number, column: number, color: string): void {
    this.socket?.emit('room:cursor', { roomId: this.roomId, userId: this.userId, line, column, color })
  }

  setTyping(isTyping: boolean): void {
    this.socket?.emit('room:typing', { roomId: this.roomId, userId: this.userId, typing: isTyping })
  }

  runCode(code: string, language: string): void {
    this.socket?.emit('code:run', { roomId: this.roomId, code, language })
  }

  disconnect(): void {
    this.socket?.emit('room:leave', { roomId: this.roomId, userId: this.userId })
    this.socket?.disconnect()
    this.socket = null
  }
}

export const roomService = new RoomService()
