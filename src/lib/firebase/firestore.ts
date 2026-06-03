import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp,
  arrayUnion, arrayRemove, type QueryConstraint, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type {
  Course,
  UserProgress,
  Quiz,
  QuizAttempt,
  CodingRoom,
  RoomFile,
  RoomParticipant,
  Certificate,
  ChatMessage,
  AppNotification,
  NLUser,
} from '@/types'

export const cols = {
  users: () => collection(db, 'users'),
  courses: () => collection(db, 'courses'),
  progress: () => collection(db, 'progress'),
  quizzes: () => collection(db, 'quizzes'),
  attempts: () => collection(db, 'attempts'),
  rooms: () => collection(db, 'rooms'),
  chat: (roomId: string) => collection(db, 'rooms', roomId, 'chat'),
  certificates: () => collection(db, 'certificates'),
  notifications: (userId: string) => collection(db, 'users', userId, 'notifications'),
}

// Courses
export const getCourses = async (constraints: QueryConstraint[] = []) => {
  const snap = await getDocs(query(cols.courses(), ...constraints))

  return snap.docs.map((d) => {
    const data = d.data() as Partial<Course>

    return {
      id: d.id,

      title: data.title ?? '',
      description: data.description ?? '',
      level: data.level ?? 'beginner',

      tags: data.tags ?? [],
      modules: data.modules ?? [],

      enrolledCount: data.enrolledCount ?? 0,
      durationHours: data.durationHours ?? 0,
      rating: data.rating ?? 0,

      thumbnailUrl: data.thumbnailUrl ?? '',
      instructorName: data.instructorName ?? 'NeuraLearn',
      instructorId: data.instructorId ?? '',

      ...data,
    } as Course
  })
}
export async function getCourseById(id: string): Promise<Course | null> {
  const snap = await getDoc(doc(db, 'courses', id))

  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...snap.data(),
  } as Course
}

export const getCourse = async (id: string) => {
  const snap = await getDoc(doc(db, 'courses', id))

  if (!snap.exists()) return null

  const data = snap.data() as Partial<Course>

  return {
    id: snap.id,

    title: data.title ?? '',
    description: data.description ?? '',
    level: data.level ?? 'beginner',

    tags: data.tags ?? [],
    modules: data.modules ?? [],

    enrolledCount: data.enrolledCount ?? 0,
    durationHours: data.durationHours ?? 0,
    rating: data.rating ?? 0,

    thumbnailUrl: data.thumbnailUrl ?? '',
    instructorName: data.instructorName ?? 'NeuraLearn',
    instructorId: data.instructorId ?? '',

    ...data,
  } as Course
}
export const createCourse = (data: Omit<Course, 'id'>) =>
  addDoc(cols.courses(), {
    ...data,

    tags: data.tags ?? [],
    modules: data.modules ?? [],

    enrolledCount: 0,
    durationHours: data.durationHours ?? 0,
    rating: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
export const updateCourse = (id: string, data: Partial<Course>) =>
  updateDoc(doc(db, 'courses', id), { ...data, updatedAt: serverTimestamp() })
export const deleteCourse = (id: string) => deleteDoc(doc(db, 'courses', id))

// Users
export const updateUserProfile = (uid: string, data: Partial<NLUser>) =>
  updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })

// Progress
export const getProgress = async (userId: string, courseId: string) => {
  const snap = await getDoc(doc(db, 'progress', `${userId}_${courseId}`))
  return snap.exists() ? (snap.data() as UserProgress) : null
}
export const markLessonComplete = (userId: string, courseId: string, lessonId: string) =>
  setDoc(doc(db, 'progress', `${userId}_${courseId}`), {
    userId, courseId, completedLessons: arrayUnion(lessonId),
    lastLessonId: lessonId, updatedAt: serverTimestamp(),
  }, { merge: true })
export const subscribeProgress = (userId: string, courseId: string, cb: (p: UserProgress | null) => void): Unsubscribe =>
  onSnapshot(doc(db, 'progress', `${userId}_${courseId}`), snap =>
    cb(snap.exists() ? (snap.data() as UserProgress) : null))

// Quiz
export const getQuiz = async (id: string) => {
  const snap = await getDoc(doc(db, 'quizzes', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Quiz) : null
}
export const submitQuizAttempt = (attempt: Omit<QuizAttempt, 'id'>) =>
  addDoc(cols.attempts(), { ...attempt, submittedAt: serverTimestamp() })

// Rooms
export const getRoom = async (id: string) => {
  const snap = await getDoc(doc(db, 'rooms', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CodingRoom) : null
}
export const getRooms = async (): Promise<CodingRoom[]> => {
  const snap = await getDocs(collection(db, 'rooms'))

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CodingRoom[]
}
export const createRoom = async (room: Partial<CodingRoom>) => {
  const cleanedRoom = Object.fromEntries(
    Object.entries(room).filter(([_, value]) => value !== undefined)
  )

  await setDoc(
    doc(db, 'rooms', room.id as string),
    {
      ...cleanedRoom,
      createdAt: serverTimestamp(),
    }
  )
}

export const subscribeRoom = (roomId: string, cb: (r: CodingRoom) => void): Unsubscribe =>
  onSnapshot(doc(db, 'rooms', roomId), snap => {
    if (snap.exists()) cb({ id: snap.id, ...snap.data() } as CodingRoom)
  })
export const subscribeChat = (roomId: string, cb: (msgs: ChatMessage[]) => void): Unsubscribe =>
  onSnapshot(query(cols.chat(roomId), orderBy('createdAt', 'asc'), limit(100)), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ChatMessage)))
export const sendChatMessage = (roomId: string, msg: Omit<ChatMessage, 'id'>) =>
  addDoc(cols.chat(roomId), { ...msg, createdAt: serverTimestamp() })

// Certificates
export const getUserCertificates = async (userId: string) => {
  const snap = await getDocs(query(cols.certificates(), where('userId', '==', userId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Certificate)
}

// Notifications
export const getNotifications = async (userId: string): Promise<AppNotification[]> => {
  const snap = await getDocs(query(cols.notifications(userId), orderBy('createdAt', 'desc'), limit(50)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as AppNotification)
}
export const subscribeNotifications = (userId: string, cb: (n: AppNotification[]) => void): Unsubscribe =>
  onSnapshot(query(cols.notifications(userId), orderBy('createdAt', 'desc'), limit(50)), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as AppNotification)))
export const markNotificationRead = (userId: string, notifId: string) =>
  updateDoc(doc(db, 'users', userId, 'notifications', notifId), { read: true })
export const markAllNotificationsRead = async (userId: string) => {
  const snap = await getDocs(query(cols.notifications(userId), where('read', '==', false)))
  const batch = snap.docs.map(d => updateDoc(d.ref, { read: true }))
  await Promise.all(batch)
}
export const createNotification = (userId: string, data: Omit<AppNotification, 'id' | 'userId'>) =>
  addDoc(cols.notifications(userId), { ...data, userId, createdAt: serverTimestamp() })
export const deleteNotification = (userId: string, notifId: string) =>
  deleteDoc(doc(db, 'users', userId, 'notifications', notifId))

// Room Files

export const addFileToRoom = async (
  roomId: string,
  file: RoomFile
) => {
  const room = await getRoom(roomId)

  if (!room) return

  await updateDoc(doc(db, 'rooms', roomId), {
    files: [...(room.files ?? []), file],
    activeFileId: file.id,
    updatedAt: serverTimestamp(),
  })
}

export const removeFileFromRoom = async (
  roomId: string,
  fileId: string
) => {
  const room = await getRoom(roomId)

  if (!room) return

  const files = room.files ?? []

  if (files.length <= 1) {
    return
  }

  const remainingFiles = files.filter(
    (file) => file.id !== fileId
  )

  const nextActiveFile =
    room.activeFileId === fileId
      ? remainingFiles[0]?.id
      : room.activeFileId

  await updateDoc(doc(db, 'rooms', roomId), {
    files: remainingFiles,
    activeFileId: nextActiveFile,
    updatedAt: serverTimestamp(),
  })
}

export const updateRoomFileContent = async (
  roomId: string,
  fileId: string,
  content: string
) => {
  const room = await getRoom(roomId)
  if (!room) return

  const files = (room.files ?? []).map((file) =>
    file.id === fileId
      ? {
          ...file,
          content,
          updatedAt: new Date(),
        }
      : file
  )

  await updateDoc(doc(db, 'rooms', roomId), {
    files,
    updatedAt: serverTimestamp(),
  })
}

export const joinRoom = async (
  roomId: string,
  participant: RoomParticipant
) => {
  const room = await getRoom(roomId)
  if (!room) return

  const participants = room.participants ?? []

  const exists = participants.some((p) => p.uid === participant.uid)

  const updatedParticipants = exists
    ? participants.map((p) =>
      p.uid === participant.uid
        ? { ...p, isOnline: true, joinedAt: new Date() }
        : p
    )
    : [...participants, participant]

  await updateDoc(doc(db, 'rooms', roomId), {
    participants: updatedParticipants,
    updatedAt: serverTimestamp(),
  })
}

export const leaveRoom = async (roomId: string, uid: string) => {
  const room = await getRoom(roomId)
  if (!room) return

  const updatedParticipants = (room.participants ?? []).map((p) =>
    p.uid === uid ? { ...p, isOnline: false } : p
  )

  await updateDoc(doc(db, 'rooms', roomId), {
    participants: updatedParticipants,
    updatedAt: serverTimestamp(),
  })
}

export const calculateRoomExpiry = (
  durationType: 'permanent' | 'timed',
  durationValue: string
): Date | null => {
  if (durationType === 'permanent') return null

  const now = new Date()

  // HH.MM.SS
  if (/^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(durationValue)) {
    const [hh, mm, ss] = durationValue.split('.').map(Number)

    return new Date(
      now.getTime() +
      hh * 60 * 60 * 1000 +
      mm * 60 * 1000 +
      ss * 1000
    )
  }

  // DD/MM:HH.MM.SS
  if (/^\d{1,2}\/\d{1,2}:\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(durationValue)) {
    const [dayMonth, time] = durationValue.split(':')
    const [days, months] = dayMonth.split('/').map(Number)
    const [hh, mm, ss] = time.split('.').map(Number)

    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + months)
    expiresAt.setDate(expiresAt.getDate() + days)
    expiresAt.setHours(expiresAt.getHours() + hh)
    expiresAt.setMinutes(expiresAt.getMinutes() + mm)
    expiresAt.setSeconds(expiresAt.getSeconds() + ss)

    return expiresAt
  }

  return null
}

export const cleanupExpiredRooms = async () => {
  const rooms = await getRooms()
  const now = new Date()

  const expiredRooms = rooms.filter((room) => {
    if (!room.expiresAt) return false

    const expiresAt =
      room.expiresAt instanceof Date
        ? room.expiresAt
        : new Date((room.expiresAt as any).seconds * 1000)

    return expiresAt <= now
  })

  await Promise.all(
    expiredRooms.map((room) => deleteDoc(doc(db, 'rooms', room.id)))
  )
}

export const deleteRoom = (roomId: string) =>
  deleteDoc(doc(db, 'rooms', roomId))


export const kickUserFromRoom = async (roomId: string, uid: string) => {
  const room = await getRoom(roomId)
  if (!room) return

  const updatedParticipants = (room.participants ?? []).filter(
    (p) => p.uid !== uid
  )

  await updateDoc(doc(db, 'rooms', roomId), {
    participants: updatedParticipants,
    updatedAt: serverTimestamp(),
  })
}

export const exitRoom = async (roomId: string, uid: string) => {
  const room = await getRoom(roomId)
  if (!room) return

  const updatedParticipants = (room.participants ?? []).filter(
    (p) => p.uid !== uid
  )

  await updateDoc(doc(db, 'rooms', roomId), {
    participants: updatedParticipants,
    updatedAt: serverTimestamp(),
  })
}

export const updateRoomFiles = async (
  roomId: string,
  files: RoomFile[],
  activeFileId?: string
) => {
  await updateDoc(doc(db, 'rooms', roomId), {
    files,
    ...(activeFileId ? { activeFileId } : {}),
    updatedAt: serverTimestamp(),
  })
}

export const shareRoomFile = async (
  roomId: string,
  fileId: string,
  sharedWith: string[]
) => {
  const room = await getRoom(roomId)
  if (!room) return

  const files = (room.files ?? []).map((file) =>
    file.id === fileId
      ? {
        ...file,
        sharedWith,
        visibility: 'public' as const,
        updatedAt: new Date(),
      }
      : file
  )

  await updateDoc(doc(db, 'rooms', roomId), {
    files,
    updatedAt: serverTimestamp(),
  })
}

export const requestFileEditPermission = async (
  roomId: string,
  fileId: string,
  uid: string,
  displayName: string
) => {
  const room = await getRoom(roomId)
  if (!room) return

  const files = (room.files ?? []).map((file) => {
    if (file.id !== fileId) return file

    const requests = file.editRequests ?? []
    const alreadyRequested = requests.some(
      (r) => r.uid === uid && r.status === 'pending'
    )

    if (alreadyRequested) return file

    return {
      ...file,
      editRequests: [
        ...requests,
        {
          uid,
          displayName,
          status: 'pending',
          requestedAt: new Date(),
        },
      ],
    }
  })

  await updateDoc(doc(db, 'rooms', roomId), {
    files,
    updatedAt: serverTimestamp(),
  })
}

export const approveFileEditPermission = async (
  roomId: string,
  fileId: string,
  uid: string
) => {
  const room = await getRoom(roomId)
  if (!room) return

  const files = (room.files ?? []).map((file) => {
    if (file.id !== fileId) return file

    return {
      ...file,
      editors: Array.from(new Set([...(file.editors ?? []), uid])),
      editRequests: (file.editRequests ?? []).map((request) =>
        request.uid === uid
          ? { ...request, status: 'approved' as const }
          : request
      ),
    }
  })

  await updateDoc(doc(db, 'rooms', roomId), {
    files,
    updatedAt: serverTimestamp(),
  })
}

export const getUsers = async (): Promise<NLUser[]> => {
  const snap = await getDocs(cols.users())

  return snap.docs.map((docSnap) => ({
    uid: docSnap.id,
    ...docSnap.data(),
  })) as NLUser[]
}

export const updateUserRolePermissions = async (
  uid: string,
  data: {
    role: 'student' | 'admin' | 'instructor'
    permissions: {
      canCreateRoom: boolean
      canCreatePrivateRoom: boolean
      canDeleteOwnRoom: boolean
      canChat: boolean
      canUseAI: boolean
      canShareFiles: boolean
      canRequestEdit: boolean
    }
  }
) => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const updateUserProfilePhoto = async (
  uid: string,
  photoURL: string
) => {
  await updateDoc(doc(db, 'users', uid), {
    photoURL,
    updatedAt: serverTimestamp(),
  })
}