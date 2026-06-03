import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut as fbSignOut,
  onAuthStateChanged, updateProfile, sendPasswordResetEmail,
  updatePassword, EmailAuthProvider, reauthenticateWithCredential,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'
import type { NLUser, UserRole } from '@/types'

const googleProvider = new GoogleAuthProvider()

export async function registerWithEmail(
  email: string, password: string, displayName: string, role: UserRole = 'student'
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid, email, displayName, role,
    enrolledCourses: [], streak: 0, skills: [],
    notificationPrefs: { email: true, push: true, quizReminders: true, courseUpdates: true, labInvites: true, achievements: true },
    createdAt: serverTimestamp(), lastActive: serverTimestamp(),
  })
  return cred.user
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, 'users', cred.user.uid), { lastActive: serverTimestamp() }, { merge: true })
  return cred.user
}

export async function loginWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider)
  const snap = await getDoc(doc(db, 'users', cred.user.uid))
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName,
      photoURL: cred.user.photoURL, role: 'student', enrolledCourses: [], streak: 0, skills: [],
      notificationPrefs: { email: true, push: true, quizReminders: true, courseUpdates: true, labInvites: true, achievements: true },
      createdAt: serverTimestamp(), lastActive: serverTimestamp(),
    })
  }
  return cred.user
}

export const signOut = () => fbSignOut(auth)
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)
export const onAuthChange = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb)

export async function getUserProfile(uid: string): Promise<NLUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as NLUser) : null
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('No user logged in')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

export const updateUserAvatar = async (
  photoURL: string
) => {
  if (!auth.currentUser) return

  await updateProfile(auth.currentUser, {
    photoURL,
  })
}