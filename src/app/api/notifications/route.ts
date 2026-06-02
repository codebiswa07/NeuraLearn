import { type NextRequest, NextResponse } from 'next/server'
import { createNotification } from '@/lib/firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { userId, type, title, message, actionUrl, metadata } = await req.json()
    if (!userId || !type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    await createNotification(userId, {
      type, title, message: message ?? '', read: false,
      createdAt: new Date(), actionUrl
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
