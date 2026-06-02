import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp,
  arrayUnion, arrayRemove, type QueryConstraint, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type {
  Course, UserProgress, Quiz, QuizAttempt, CodingRoom,
  Certificate, ChatMessage, AppNotification, NLUser
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
