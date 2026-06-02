'use client'
import { Copy, Link2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import type { RoomParticipant } from '@/types'

interface UserPresenceProps { participants: RoomParticipant[]; inviteCode: string; roomId: string }
export function UserPresence({ participants, inviteCode, roomId }: UserPresenceProps) {
  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/coding/room/${roomId}?invite=${inviteCode}`)
  }
  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participants</span>
        <Badge variant="green" dot>{participants.filter(p=>p.isOnline).length} online</Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        {participants.map(p => (
          <div key={p.uid} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="relative">
              <Avatar name={p.displayName} uid={p.uid} size="xs" />
              <span className={cn('absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-slate-950', p.isOnline ? 'bg-green-500' : 'bg-slate-400')} />
            </div>
            <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{p.displayName}</span>
            {p.role === 'host' && <Badge variant="blue" className="text-[10px] px-1.5 py-0">host</Badge>}
          </div>
        ))}
      </div>
      <button onClick={copyInvite}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
        <Link2 className="w-3.5 h-3.5" /> Copy invite link
      </button>
    </div>
  )
}
