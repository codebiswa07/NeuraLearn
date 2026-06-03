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
  onSend: (text: string) => void | Promise<void>
  activeTab: 'chat' | 'ai'
  onSwitchTab: (tab: 'chat' | 'ai') => void
  canSend?: boolean
}

export function RoomChat({ messages, userId, onSend, activeTab, onSwitchTab, canSend = true, }: RoomChatProps) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  const [aiMessages, setAiMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([])

  const [aiLoading, setAiLoading] = useState(false)
  const send = async () => {
    const value = text.trim()
    if (!value) return

    if (activeTab === 'chat') {
      if (!canSend) return

      await onSend(value)
      setText('')
      return
    }

    if (activeTab === 'ai') {
      setText('')
      setAiMessages((prev) => [...prev, { role: 'user', text: value }])
      setAiLoading(true)

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: value }),
        })

        const data = await res.json()

        setAiMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply ?? 'I could not generate a response.',
          },
        ])
      } catch {
        setAiMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'AI assistant is unavailable right now.',
          },
        ])
      } finally {
        setAiLoading(false)
      }
    }
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {activeTab === 'chat' ? (
          <>
            {messages.length === 0 ? (
              <div className="text-xs text-slate-400 text-center mt-6">
                No room messages yet.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex flex-col',
                    m.userId === userId && 'items-end'
                  )}
                >
                  {m.userId !== userId && (
                    <div className="flex items-center gap-1 mb-1">
                      <Avatar name={m.displayName} uid={m.userId} size="xs" />
                      <span className="text-[10px] font-semibold text-slate-400">
                        {m.displayName}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[90%] rounded-lg px-1.5 py-0.5 text-[14px] font-semibold leading-relaxed',
                      m.type === 'code' && 'font-mono text-xs',
                      m.userId === userId
                        ? 'bg-gray-500 dark:bg-gray-200 text-green-800 dark:text-gray-900 rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}

            <div ref={bottomRef} />
          </>
        ) : (
          <>
            {aiMessages.length === 0 && (
              <div className="text-xs text-slate-400 text-center mt-6">
                Ask AI for hints, debugging help, or code explanation.
              </div>
            )}

            {aiMessages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[90%] rounded-lg px-1.5 py-0.5 text-[14px] font-semibold leading-relaxed',
                  m.role === 'user'
                    ? 'self-end bg-gray-500 dark:bg-gray-200 text-green-800 dark:text-gray-900'
                    : 'self-start bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                )}
              >
                {m.text}
              </div>
            ))}

            {aiLoading && (
              <div className="text-xs text-slate-400">
                AI is thinking...
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-2 flex-shrink-0">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={
            activeTab === 'chat'
              ? 'Message the room…'
              : 'Ask AI assistant…'
          }
          rows={1}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none focus:ring-1 focus:ring-brand-500/30"
        />
        <button onClick={send} disabled={!canSend}
          className="w-8 h-8 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
