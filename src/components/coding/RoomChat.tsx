'use client'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import { fmtRelative } from '@/utils/formatters'
import type { ChatMessage } from '@/types'

interface RoomChatProps {
  messages: ChatMessage[]
  userId: string
  onSend: (text: string, type?: 'text' | 'code') => void
  onSwitchTab?: (tab: 'chat' | 'ai') => void
  activeTab?: 'chat' | 'ai'
}

export function RoomChat({ messages, userId, onSend, onSwitchTab, activeTab = 'chat' }: RoomChatProps) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {(['chat', 'ai'] as const).map(t => (
          <button key={t} onClick={() => onSwitchTab?.(t)}
            className={cn('flex-1 py-2 text-xs font-semibold transition-all capitalize', activeTab === t
              ? 'text-brand-600 border-b-2 border-brand-600'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300')}>
            {t === 'ai' ? '🤖 AI Assist' : '💬 Chat'}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className={cn('flex flex-col', m.userId === userId && 'items-end')}>
            {m.userId !== userId && (
              <div className="flex items-center gap-1 mb-1">
                <Avatar name={m.displayName} uid={m.userId} size="xs" />
                <span className="text-[10px] font-semibold text-slate-400">{m.displayName}</span>
              </div>
            )}
            <div className={cn(
              'max-w-[90%] rounded-lg px-3 py-2 text-[13px] leading-relaxed',
              m.type === 'code' && 'font-mono text-xs',
              m.userId === userId
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-tr-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'
            )}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-2 flex-shrink-0">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Message the room…"
          rows={1}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none focus:ring-1 focus:ring-brand-500/30"
        />
        <button onClick={send}
          className="w-8 h-8 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
