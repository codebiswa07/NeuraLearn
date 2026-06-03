import { createServer } from 'http'
import { Server, type Socket } from 'socket.io'

type JoinRoomPayload = {
  roomId: string
  userId: string
}

type CodeRunPayload = {
  roomId: string
  code: string
  language: string
}

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('NeuraLearn Socket.IO server is running')
})

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.APP_URL,
].filter(Boolean) as string[]

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const rooms = new Map<string, Set<string>>()

io.on('connection', (socket: Socket) => {
  console.log(`[Socket] connected: ${socket.id}`)

  socket.on('room:join', ({ roomId, userId }: JoinRoomPayload) => {
    if (!roomId || !userId) return

    socket.join(roomId)
    socket.data.userId = userId
    socket.data.roomId = roomId

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }

    rooms.get(roomId)!.add(userId)

    socket.to(roomId).emit('room:user_join', {
      uid: userId,
      isOnline: true,
      joinedAt: new Date().toISOString(),
    })

    io.to(roomId).emit('room:presence', {
      roomId,
      users: Array.from(rooms.get(roomId)!),
    })

    console.log(`[Room] ${userId} joined ${roomId}`)
  })

  socket.on('room:leave', ({ roomId, userId }: JoinRoomPayload) => {
    if (!roomId || !userId) return

    socket.leave(roomId)
    rooms.get(roomId)?.delete(userId)

    socket.to(roomId).emit('room:user_leave', {
      uid: userId,
    })

    io.to(roomId).emit('room:presence', {
      roomId,
      users: Array.from(rooms.get(roomId) || []),
    })

    console.log(`[Room] ${userId} left ${roomId}`)
  })

  socket.on('room:cursor', (data) => {
    if (!data?.roomId) return
    socket.to(data.roomId).emit('room:cursor', data)
  })

  socket.on('room:typing', (data) => {
    if (!data?.roomId) return
    socket.to(data.roomId).emit('room:typing', data)
  })

  socket.on('code:run', ({ roomId, code, language }: CodeRunPayload) => {
    if (!roomId) return

    setTimeout(() => {
      io.to(roomId).emit('code:output', {
        output: `[Mock] ${language} execution complete\n> ${code
          ?.split('\n')[0]
          ?.substring(0, 50) || ''}...`,
        error: null,
      })
    }, 600)
  })

  socket.on('disconnect', () => {
    const userId = socket.data.userId as string | undefined
    const roomId = socket.data.roomId as string | undefined

    if (userId && roomId) {
      rooms.get(roomId)?.delete(userId)

      socket.to(roomId).emit('room:user_leave', {
        uid: userId,
      })

      io.to(roomId).emit('room:presence', {
        roomId,
        users: Array.from(rooms.get(roomId) || []),
      })

      console.log(`[Socket] disconnected: ${userId} from ${roomId}`)
    } else {
      console.log(`[Socket] disconnected: ${socket.id}`)
    }
  })
})

const PORT = Number(process.env.PORT) || 3001

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Socket.IO] server running on port ${PORT}`)
})