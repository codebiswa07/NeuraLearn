/**
 * Socket.io server — run as: npx ts-node src/services/websocket/server.ts
 * Or integrate with Next.js custom server
 */
import { createServer } from 'http'
import { Server, type Socket } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', methods: ['GET', 'POST'] }
})

const rooms = new Map<string, Set<string>>() // roomId → Set<userId>

io.on('connection', (socket: Socket) => {
  console.log(`[Socket] connect: ${socket.id}`)

  socket.on('room:join', ({ roomId, userId }: { roomId: string; userId: string }) => {
    socket.join(roomId)
    if (!rooms.has(roomId)) rooms.set(roomId, new Set())
    rooms.get(roomId)!.add(userId)
    socket.to(roomId).emit('room:user_join', { uid: userId, isOnline: true, joinedAt: new Date() })
    console.log(`[Room] ${userId} joined ${roomId}`)
  })

  socket.on('room:leave', ({ roomId, userId }: { roomId: string; userId: string }) => {
    socket.leave(roomId)
    rooms.get(roomId)?.delete(userId)
    socket.to(roomId).emit('room:user_leave', { uid: userId })
  })

  socket.on('room:cursor', (data) => {
    socket.to(data.roomId).emit('room:cursor', data)
  })

  socket.on('room:typing', (data) => {
    socket.to(data.roomId).emit('room:typing', data)
  })

  socket.on('code:run', async ({ roomId, code, language }: { roomId: string; code: string; language: string }) => {
    // Integrate with Judge0 / Piston API here
    // Mock response for development:
    setTimeout(() => {
      io.to(roomId).emit('code:output', {
        output: `[Mock] ${language} execution complete\n> ${code.split('\n')[0].substring(0, 50)}...`,
        error: null,
      })
    }, 600)
  })

  socket.on('disconnect', () => {
    rooms.forEach((users, roomId) => {
      users.forEach(uid => {
        if (uid === (socket.handshake.auth as { userId: string }).userId) {
          users.delete(uid)
          socket.to(roomId).emit('room:user_leave', { uid })
        }
      })
    })
  })
})

const PORT = process.env.WS_PORT || 3001
httpServer.listen(PORT, () => console.log(`[Socket.io] running on :${PORT}`))
