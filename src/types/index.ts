// ─── User & Auth ─────────────────────────────────────────────────────────
export type UserRole = 'student' | 'instructor' | 'admin'

export interface NLUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  enrolledCourses: string[]
  createdAt: Date
  lastActive: Date
  streak: number
}

// ─── Course ───────────────────────────────────────────────────────────────
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived'

export interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  instructorId: string
  instructorName: string
  level: CourseLevel
  status: CourseStatus
  modules: CourseModule[]
  tags: string[]
  enrolledCount: number
  rating: number
  durationHours: number
  createdAt: Date
  updatedAt: Date
}

export interface CourseModule {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'article' | 'coding' | 'quiz'
  durationMins: number
  videoUrl?: string
  content?: string
  resourceUrls?: string[]
  order: number
}

// ─── Progress ─────────────────────────────────────────────────────────────
export interface UserProgress {
  userId: string
  courseId: string
  completedLessons: string[]
  quizScores: Record<string, number>
  lastLessonId: string
  completionPct: number
  startedAt: Date
  completedAt?: Date
}

// ─── Quiz ─────────────────────────────────────────────────────────────────
export interface Quiz {
  id: string
  courseId: string
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimitSecs: number
  passingScore: number
  attempts: number
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  points: number
  type: 'mcq' | 'true_false' | 'multi_select'
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  answers: number[]
  score: number
  timeTakenSecs: number
  submittedAt: Date
}

// ─── Coding Lab ───────────────────────────────────────────────────────────
export type EditorLanguage = 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'cpp'

export interface CodingRoom {
  id: string
  name: string
  courseId?: string
  hostId: string
  participants: RoomParticipant[]
  files: RoomFile[]
  activeFileId: string
  language: EditorLanguage
  isPublic: boolean
  inviteCode: string
  createdAt: Date
}

export interface RoomParticipant {
  uid: string
  displayName: string
  avatarColor: string
  role: 'host' | 'participant'
  isOnline: boolean
  cursorLine?: number
  cursorCol?: number
  joinedAt: Date
}

export interface RoomFile {
  id: string
  name: string
  language: EditorLanguage
  content: string
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  roomId: string
  userId: string
  displayName: string
  text: string
  type: 'text' | 'code' | 'system'
  createdAt: Date
}

// ─── Certificate ──────────────────────────────────────────────────────────
export interface Certificate {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  userName: string
  issuedAt: Date
  verificationCode: string
}

// ─── AI ───────────────────────────────────────────────────────────────────
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
}


export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  userId?: string

  title: string
  message: string
  type: NotificationType

  read: boolean

  createdAt: Date | any
  updatedAt?: Date | any

  actionUrl?: string
  actionLabel?: string
}

export interface TutorChatMessage {
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export interface TopicDetail {
  id: string
  name: string
  progress: number
  badge: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  codeTemplate: string
  aiExplanation: string
  consoleOutput: string[]
}

export interface RoadmapLevel {
  level: number
  title: string
  description: string
  progress: string
  locked?: boolean
}

export interface Achievement {
  icon: string
  title: string
  description: string
  locked?: boolean
}

export interface PlatformStat {
  value: string
  label: string
}