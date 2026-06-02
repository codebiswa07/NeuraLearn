/**
 * Seed Firestore with sample data
 * Run: npx ts-node --skip-project src/lib/firebase/seed.ts
 * Requires GOOGLE_APPLICATION_CREDENTIALS env var set to your service account JSON
 */
// @ts-ignore: firebase-admin package may not be installed in the editor environment
import { initializeApp, cert, getFirestore } from 'firebase-admin'

const app = initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!) })
const db = getFirestore(app)

const courses = [
  { title: 'Full-Stack Web Development',     level: 'intermediate', thumbnailUrl: '🌐', description: 'Build production-grade full-stack apps with Next.js, Node.js, and databases.', durationHours: 42, enrolledCount: 2400, tags: ['React','Node.js','Databases'], status: 'published', rating: 4.8, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
  { title: 'Data Structures & Algorithms',   level: 'advanced',     thumbnailUrl: '🧩', description: 'Master DSA fundamentals and crack coding interviews at top tech companies.', durationHours: 38, enrolledCount: 3100, tags: ['DSA','LeetCode','Interviews'], status: 'published', rating: 4.9, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
  { title: 'Machine Learning Fundamentals',  level: 'beginner',     thumbnailUrl: '🤖', description: 'From linear regression to neural networks — ML concepts from first principles.', durationHours: 56, enrolledCount: 5200, tags: ['Python','ML','AI'], status: 'published', rating: 4.7, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
  { title: 'System Design Mastery',          level: 'advanced',     thumbnailUrl: '🏗️', description: 'Design scalable, distributed systems used at companies like Google, Netflix, Uber.', durationHours: 24, enrolledCount: 1800, tags: ['Architecture','Distributed','Scale'], status: 'published', rating: 4.9, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
  { title: 'TypeScript Deep Dive',           level: 'intermediate', thumbnailUrl: '📘', description: 'Go beyond basic types — generics, utility types, decorators, and advanced patterns.', durationHours: 30, enrolledCount: 4000, tags: ['TypeScript','JavaScript'], status: 'published', rating: 4.8, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
  { title: 'Cloud Architecture (AWS)',        level: 'advanced',     thumbnailUrl: '☁️', description: 'Design and deploy resilient cloud architectures on AWS with IaC and CI/CD.', durationHours: 48, enrolledCount: 2900, tags: ['AWS','Cloud','DevOps'], status: 'published', rating: 4.7, modules: [], instructorId: 'admin', instructorName: 'NeuraLearn Team' },
]

async function seed() {
  console.log('🌱 Seeding Firestore...')
  for (const course of courses) {
    const ref = db.collection('courses').doc()
    await ref.set({ ...course, id: ref.id, createdAt: new Date(), updatedAt: new Date() })
    console.log(`  ✓ Course: ${course.title}`)
  }
  console.log('✅ Seed complete')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
