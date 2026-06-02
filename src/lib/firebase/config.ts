import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getDatabase, type Database } from 'firebase/database'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

const app: FirebaseApp  = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth: Auth         = getAuth(app)
const db: Firestore      = getFirestore(app)
const storage: FirebaseStorage = getStorage(app)
const rtdb: Database     = getDatabase(app)

export { app, auth, db, storage, rtdb }
