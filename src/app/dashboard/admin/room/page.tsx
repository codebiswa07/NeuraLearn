'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Code2,
    Plus,
    Users,
    Lock,
    Globe,
    BookOpen,
    Sparkles,
} from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { createRoom, getRooms } from '@/lib/firebase/firestore'
import type { CodingRoom } from '@/types'


export default function AdminRoomPage() {
    const [existingRooms, setExistingRooms] = useState<CodingRoom[]>([])
    useEffect(() => {
        getRooms().then(setExistingRooms)
    }, [])
    const router = useRouter()
    const [roomName, setRoomName] = useState('')
    const [topic, setTopic] = useState('')
    const [level, setLevel] = useState('Beginner')
    const [visibility, setVisibility] = useState('Public')
    const [aiHelp, setAiHelp] = useState(true)

    const handleCreateRoom = async () => {
        if (!roomName.trim()) return

        const generatedId =
            roomName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') || `room-${Date.now()}`

        const room: Partial<CodingRoom> = {
            id: generatedId,
            name: roomName,
            language: 'typescript',
            isPublic: visibility === 'Public',
            inviteCode: `NL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,

            roomType: 'admin',
            chatMode: 'admin_only',
            isOfficial: true,

            hostId: 'admin',
            participants: [],
            files: [
                {
                    id: 'main',
                    name: 'main.ts',
                    language: 'typescript',
                    content: '// Start coding here',
                    updatedAt: new Date(),
                },
            ],
            activeFileId: 'main',
        }

        await createRoom(room)

        router.push(`/coding/room/${generatedId}`)
    }

    return (
        <div className="p-6 max-w-[1200px] animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Manage Coding Rooms
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create coding rooms for students and manage live practice sessions.
                    </p>
                </div>

                {/* <Button variant="primary" size="md" onClick={createRoom}>
          <Plus className="w-4 h-4" />
          Create Room
        </Button> */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Rooms" value="2" change="Active labs" changeType="neutral" />
                <StatCard label="Live Students" value="8" change="Currently joined" changeType="up" />
                <StatCard label="AI Help" value="Enabled" change="Hints active" changeType="up" />
                <StatCard label="Admin Mode" value="On" change="Room control" changeType="neutral" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        Create New Room
                    </h2>

                    <Card className="p-5 space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-slate-500">
                                Room Name
                            </label>
                            <Input
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Example: DSA Practice Room"
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500">
                                Coding Topic
                            </label>
                            <Input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Example: Arrays, React Hooks, JavaScript"
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500">
                                    Difficulty Level
                                </label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500">
                                    Visibility
                                </label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                >
                                    <option>Public</option>
                                    <option>Private</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAiHelp(!aiHelp)}
                            className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left dark:bg-slate-800/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        AI Coding Help
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Allow students to ask for hints during coding.
                                    </p>
                                </div>
                            </div>

                            <Badge variant={aiHelp ? 'green' : 'slate'}>
                                {aiHelp ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </button>

                        <Button variant="primary" size="md" onClick={handleCreateRoom}>
                            <Code2 className="w-4 h-4" />
                            Create & Open Room
                        </Button>
                    </Card>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        Existing Rooms
                    </h2>

                    <Card className="p-4 space-y-3">
                        {existingRooms.map((room) => (
                            <div
                                key={room.id}
                                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {room.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {room.language ?? 'typescript'}
                                        </p>
                                    </div>

                                    {room.isPublic ? (
                                        <Globe className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {room.participants?.length ?? 0} joined
                                    </span>

                                    <button
                                        onClick={() => router.push(`/coding/room/${room.id}`)}
                                        className="text-brand-600 font-semibold hover:underline"
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Card>

                    <Card className="p-4 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Admin Tip
                                </p>
                                <p className="text-xs text-slate-500">
                                    Use one room per topic to keep student collaboration focused.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}