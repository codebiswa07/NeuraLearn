'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { AIMessage } from '@/types'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const QUICK_PROMPTS = [
  'Explain closures in JavaScript',
  'What is Big O notation?',
  'How does React reconciliation work?',
  'Suggest a learning roadmap for ML',
  'What are SOLID principles?',
  'How does async/await work?',
]

export function AITutor() {
  const { aiHistory, addAIMessage, clearAIHistory, user } = useAppStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiHistory, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: AIMessage = { role: 'user', content: text.trim(), createdAt: new Date() }
    addAIMessage(userMsg)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiHistory, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: { userName: user?.displayName, enrolledCourses: user?.enrolledCourses }
        }),
      })
      const data = await res.json()
      addAIMessage({ role: 'assistant', content: data.reply ?? 'Sorry, I had trouble with that. Please try again.', createdAt: new Date() })
    } catch {
      addAIMessage({ role: 'assistant', content: 'Connection error. Please check your API key in .env.local.', createdAt: new Date() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {aiHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🤖</div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">AI Tutor</h3>
            <p className="text-sm text-slate-500">Ask me anything — code, concepts, or learning paths.</p>
          </div>
        )}
        {aiHistory.map((msg, i) => (
          <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0',
              msg.role === 'assistant' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-brand-600')}>
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed overflow-hidden",
                msg.role === "assistant"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  : "bg-brand-600 text-white rounded-tr-sm"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");

                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {aiHistory.length === 0 && (
        <div className="px-2 pb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-all border border-slate-200 dark:border-slate-700">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex gap-2 items-end">
        {aiHistory.length > 0 && (
          <button onClick={clearAIHistory} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Ask about code, concepts, or your learning path…"
          rows={1}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none focus:ring-1 focus:ring-brand-500/30"
        />
        <Button variant="primary" size="sm" onClick={() => sendMessage(input)} loading={loading} className="flex-shrink-0 rounded-xl">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
