'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { editor } from 'monaco-editor'
import { Play, Square, Terminal, Users, FileCode2, ArrowDown01 } from 'lucide-react'
import type { CodingRoom } from '@/types'
import { cn } from '@/utils/cn'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 bg-[#1a1d2e] flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">
          Loading editor…
        </div>
      </div>
    ),
  }
)

interface CollabEditorProps {
  room: CodingRoom
  userId: string
  ydoc?: unknown
  onRun: (code: string) => void
}

export function CollabEditor({
  room,
  userId,
  ydoc,
  onRun,
}: CollabEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const [activeFileId, setActiveFileId] = useState(
    room.activeFileId ?? room.files?.[0]?.id
  )

  const [output, setOutput] = useState<
    Array<{ text: string; type: 'info' | 'success' | 'error' }>
  >([{ text: 'Ready. Press ▶ Run to execute.', type: 'info' }])

  const [running, setRunning] = useState(false)
  const [showOutput, setShowOutput] = useState(true)

  const files = room.files ?? []
  const activeFile =
    files.find((file) => file.id === activeFileId) ?? files[0]

  const onlineCount = room.participants?.filter((p) => p.isOnline).length ?? 0

  useEffect(() => {
    if (!activeFileId && files[0]?.id) {
      setActiveFileId(files[0].id)
    }
  }, [activeFileId, files])

  const handleMount = useCallback(
    (
      ed: editor.IStandaloneCodeEditor,
      monaco: typeof import('monaco-editor')
    ) => {
      editorRef.current = ed

      monaco.editor.defineTheme('neuralearn-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          {
            token: 'comment',
            foreground: '5c6370',
            fontStyle: 'italic',
          },
          { token: 'keyword', foreground: 'c678dd' },
          { token: 'string', foreground: '98c379' },
          { token: 'number', foreground: 'd19a66' },
          { token: 'type', foreground: 'e5c07b' },
          { token: 'function', foreground: '61afef' },
        ],
        colors: {
          'editor.background': '#1a1d2e',
          'editor.foreground': '#abb2bf',
          'editorLineNumber.foreground': '#3d4455',
          'editor.lineHighlightBackground': '#21243a',
          'editorGutter.background': '#1a1d2e',
          'editor.selectionBackground': '#3d4455',
        },
      })

      monaco.editor.setTheme('neuralearn-dark')

      if (ydoc) {
        import('y-monaco')
          .then(({ MonacoBinding }) => {
            const yText = (
              ydoc as { getText: (key: string) => unknown }
            ).getText('monaco')

            const model = ed.getModel()

            if (model && yText) {
              // new MonacoBinding(yText, model, new Set([ed]))
            }
          })
          .catch(console.warn)
      }
    },
    [ydoc]
  )

  const runCode = async () => {
    if (!editorRef.current || running) return

    const code = editorRef.current.getValue()

    setRunning(true)
    setShowOutput(true)

    setOutput([
      {
        text: `▶ Running ${activeFile?.language ?? room.language}…`,
        type: 'info',
      },
    ])

    onRun(code)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: activeFile?.language ?? room.language,
        }),
      })

      const data = await res.json()

      const lines: Array<{
        text: string
        type: 'info' | 'success' | 'error'
      }> = []

      if (data.stdout) {
        data.stdout
          .split('\n')
          .filter(Boolean)
          .forEach((line: string) =>
            lines.push({
              text: line,
              type: 'success',
            })
          )
      }

      if (data.stderr) {
        data.stderr
          .split('\n')
          .filter(Boolean)
          .forEach((line: string) =>
            lines.push({
              text: line,
              type: 'error',
            })
          )
      }

      if (!data.stdout && !data.stderr) {
        lines.push({
          text: 'Execution completed (no output)',
          type: 'info',
        })
      }

      setOutput(lines)
    } catch {
      setOutput([
        {
          text: 'Execution service unavailable',
          type: 'error',
        },
      ])
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1a1d2e]">
      {/* TASKBAR FILE STRIP */}
      <div className="h-11 bg-[#11131d]/95 backdrop-blur border-b border-white/5 flex items-center flex-shrink-0">
        <div className="flex items-center gap-1 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide w-full">
          {files.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/40">
              <FileCode2 className="w-3.5 h-3.5" />
              No files
            </div>
          ) : (
            files.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={cn(
                  'shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all font-mono',
                  file.id === activeFileId
                    ? 'bg-[#1a1d2e] text-white border-brand-500/50 shadow-sm'
                    : 'bg-white/[0.03] text-white/45 border-white/5 hover:text-white/80 hover:bg-white/[0.06]'
                )}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                {file.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* MAIN EDITOR */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          key={activeFile?.id}
          height="100%"
          language={activeFile?.language ?? room.language}
          value={activeFile?.content ?? '// Start coding...\n'}
          onMount={handleMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            smoothScrolling: true,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
          }}
        />
      </div>

      {/* SCALABLE TASKBAR TOOLBAR */}
      <div className="h-12 bg-[#11131d]/95 backdrop-blur border-t border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          {/* Left Actions */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide min-w-0">
            <button
              onClick={runCode}
              disabled={running}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-all"
            >
              {running ? (
                <Square className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {running ? 'Running…' : 'Run'}
            </button>

            <button
              onClick={() => setShowOutput((prev) => !prev)}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] text-white/70 text-xs font-medium rounded-lg transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              {showOutput ? 'Hide Output' : 'Show Output'}
            </button>

            <div className="shrink-0 h-6 w-px bg-white/10" />

            <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] text-[11px] text-white/45">
              <FileCode2 className="w-3.5 h-3.5" />
              {activeFile?.language ?? room.language}
            </div>
          </div>


            <button>
              <ArrowDown01 className="w-3.5 h-3.5 text-white/50 hover:text-white transition-all" />
              
            </button>


          {/* Right Status */}
          <div className="shrink-0 hidden sm:flex items-center gap-3 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {onlineCount} online
            </span>

            <span>Collaborative</span>
          </div>
        </div>
      </div>

      {/* OUTPUT PANEL */}
      {showOutput && (
        <div className="h-[120px] bg-[#0d1117] border-t border-white/5 px-4 py-2.5 font-mono text-xs overflow-y-auto flex-shrink-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/20 mb-1.5">
            Output
          </div>

          {output.map((line, index) => (
            <div
              key={index}
              className={cn('leading-relaxed', {
                'text-green-400': line.type === 'success',
                'text-red-400': line.type === 'error',
                'text-slate-500': line.type === 'info',
              })}
            >
              {line.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}