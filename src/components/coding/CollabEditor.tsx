'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { editor } from 'monaco-editor'
import {
  Play,
  Plus,
  X,
  Square,
  Terminal,
  Users,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  RotateCcw,
  SquareArrowOutUpRight,
  EyeOff,
  Eye,
} from 'lucide-react'
import type { CodingRoom, RoomFile, EditorLanguage } from '@/types'
import { cn } from '@/utils/cn'
import {
  addFileToRoom,
  removeFileFromRoom,
  updateRoomFileContent,
  updateRoomFiles,
  shareRoomFile,
  approveFileEditPermission,
  requestFileEditPermission,
} from '@/lib/firebase/firestore'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#101624]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400 animate-pulse">
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

type OutputLine = {
  text: string
  type: 'info' | 'success' | 'error'
}

export function CollabEditor({ room, userId, ydoc, onRun }: CollabEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const [localFiles, setLocalFiles] = useState<RoomFile[]>(room.files ?? [])
  const [activeFileId, setActiveFileId] = useState(
    room.activeFileId ?? room.files?.[0]?.id
  )

  useEffect(() => {
    setLocalFiles(room.files ?? [])
  }, [room.files])

  const canViewFile = (file: RoomFile) => {
    const isHost = userId === room.hostId
    const isOwner = file.ownerId === userId
    const isShared = file.sharedWith?.includes(userId)

    if (file.visibility === 'host_public') {
      if (isHost) return true
      return file.isVisible !== false
    }

    if (file.visibility === 'public') {
      return isOwner || isShared
    }

    if (file.visibility === 'host_only') {
      return isOwner || isHost
    }

    if (file.visibility === 'private') {
      return isOwner || isShared
    }

    return false
  }
  const files = localFiles.filter(canViewFile)
  const activeFile =
    files.find((file) => file.id === activeFileId) ?? files[0]

  const [output, setOutput] = useState<OutputLine[]>([
    { text: 'Ready. Press Run to execute.', type: 'info' },
  ])


  const [running, setRunning] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [copied, setCopied] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  const onlineCount = room.participants?.filter((p) => p.isOnline).length ?? 0
  const language = activeFile?.language ?? room.language ?? 'typescript'

  useEffect(() => {
    if (!activeFileId && files[0]?.id) {
      setActiveFileId(files[0].id)
    }

    if (activeFileId && files.length > 0) {
      const exists = files.some((file) => file.id === activeFileId)

      if (!exists) {
        setActiveFileId(files[0].id)
      }
    }
  }, [activeFileId, files])

  const getLanguageFromFileName = (fileName: string): EditorLanguage => {
    const name = fileName.toLowerCase()

    if (name.endsWith('.tsx')) return 'typescript'
    if (name.endsWith('.ts')) return 'typescript'
    if (name.endsWith('.jsx')) return 'javascript'
    if (name.endsWith('.js')) return 'javascript'
    if (name.endsWith('.py')) return 'python'
    if (name.endsWith('.cpp')) return 'cpp'
    if (name.endsWith('.c')) return 'cpp'

    return 'typescript'
  }

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
          { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'a78bfa' },
          { token: 'string', foreground: '86efac' },
          { token: 'number', foreground: 'fbbf24' },
          { token: 'type', foreground: 'facc15' },
          { token: 'function', foreground: '60a5fa' },
        ],
        colors: {
          'editor.background': '#101624',
          'editor.foreground': '#d1d5db',
          'editorLineNumber.foreground': '#475569',
          'editor.lineHighlightBackground': '#172033',
          'editorGutter.background': '#101624',
          'editor.selectionBackground': '#334155',
          'editorCursor.foreground': '#60a5fa',
        },
      })

      monaco.editor.setTheme('neuralearn-dark')

      setTimeout(() => {
        ed.layout()
        ed.focus()
      }, 80)

      if (ydoc) {
        import('y-monaco')
          .then(() => {
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

  const createNewFile = async () => {
    const fileName = prompt('Enter file name, example: app.tsx')

    if (!fileName?.trim()) return

    const trimmedName = fileName.trim()

    const alreadyExists = localFiles.some(
      (file) =>
        file.name.toLowerCase() === trimmedName.toLowerCase() &&
        file.ownerId === userId
    )

    if (alreadyExists) {
      alert('You already have a file with this name.')
      return
    }

    const isHost = userId === room.hostId

    const visibility = isHost
      ? 'host_public'
      : (prompt(
        'Choose visibility: public, host_only, or private',
        'private'
      ) as RoomFile['visibility'])

    const safeVisibility: RoomFile['visibility'] =
      visibility === 'public' ||
        visibility === 'host_only' ||
        visibility === 'private'
        ? visibility
        : isHost
          ? 'host_public'
          : 'private'

    const newFile: RoomFile = {
      id: crypto.randomUUID(),
      name: trimmedName,
      language: getLanguageFromFileName(trimmedName),
      content: '',
      updatedAt: new Date(),

      ownerId: userId,
      ownerName: isHost ? 'Host' : 'Student',

      visibility: isHost ? 'host_public' : safeVisibility,
      isVisible: true,
      sharedWith: [],
    }

    try {
      await addFileToRoom(room.id, newFile)
      setActiveFileId(newFile.id)
    } catch {
      alert('Unable to create file.')
    }
  }

  const removeFile = async (fileId: string) => {
    if (files.length <= 1) {
      setOutput([
        {
          text: 'At least one file must remain.',
          type: 'error',
        },
      ])
      setShowOutput(true)
      return
    }

    const target = files.find((file) => file.id === fileId)
    if (!target) return

    const confirmed = confirm(`Delete "${target.name}"?`)
    if (!confirmed) return

    try {
      await removeFileFromRoom(room.id, fileId)
    } catch {
      setOutput([
        {
          text: 'Unable to remove file.',
          type: 'error',
        },
      ])
      setShowOutput(true)
    }
  }

  const runCode = async () => {
    if (!editorRef.current || running) return

    const code = editorRef.current.getValue()

    setRunning(true)
    setShowOutput(true)
    setOutput([{ text: `Running ${language}...`, type: 'info' }])

    onRun(code)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      const data = await res.json()
      const lines: OutputLine[] = []

      if (data.stdout) {
        data.stdout
          .split('\n')
          .filter(Boolean)
          .forEach((line: string) => {
            lines.push({ text: line, type: 'success' })
          })
      }

      if (data.stderr) {
        data.stderr
          .split('\n')
          .filter(Boolean)
          .forEach((line: string) => {
            lines.push({ text: line, type: 'error' })
          })
      }

      if (!data.stdout && !data.stderr) {
        lines.push({ text: 'Execution completed with no output.', type: 'info' })
      }

      setOutput(lines)
    } catch {
      setOutput([{ text: 'Execution service unavailable.', type: 'error' }])
    } finally {
      setRunning(false)
    }
  }

  const copyCode = async () => {
    if (!editorRef.current) return

    await navigator.clipboard.writeText(editorRef.current.getValue())
    setCopied(true)

    setTimeout(() => setCopied(false), 1200)
  }

  const resetOutput = () => {
    setOutput([{ text: 'Output cleared.', type: 'info' }])
  }

  const toggleFileVisibility = async (fileId: string) => {
    const updatedFiles = localFiles.map((file) =>
      file.id === fileId
        ? {
          ...file,
          isVisible: file.isVisible === false,
          updatedAt: new Date(),
        }
        : file
    )

    setLocalFiles(updatedFiles)
    await updateRoomFiles(room.id, updatedFiles)
  }

  const shareFile = async (fileId: string) => {
    const target = localFiles.find((file) => file.id === fileId)
    if (!target) return

    if (target.ownerId !== userId && userId !== room.hostId) {
      alert('Only file owner or host can share this file.')
      return
    }

    const users = room.participants ?? []

    const list = users
      .filter((p) => p.uid !== userId)
      .map((p, index) => `${index + 1}. ${p.displayName}`)
      .join('\n')

    if (!list) {
      alert('No users available to share with.')
      return
    }

    const input = prompt(
      `Share "${target.name}" with users:\n\n${list}\n\nEnter numbers separated by comma, example: 1,2`
    )

    if (!input) return

    const selectedIndexes = input
      .split(',')
      .map((item) => Number(item.trim()) - 1)
      .filter((index) => index >= 0 && index < users.length)

    const selectedUserIds = selectedIndexes
      .map((index) => users.filter((p) => p.uid !== userId)[index]?.uid)
      .filter(Boolean) as string[]

    if (selectedUserIds.length === 0) {
      alert('No valid users selected.')
      return
    }

    await shareRoomFile(room.id, fileId, selectedUserIds)
  }

  const handleCodeChange = async (value?: string) => {
    if (!activeFile || value === undefined) return

    if (!canEditFile(activeFile)) {
      return
    }

    const updatedFiles = localFiles.map((file) =>
      file.id === activeFile.id
        ? {
          ...file,
          content: value,
          updatedAt: new Date(),
        }
        : file
    )

    setLocalFiles(updatedFiles)

    await updateRoomFileContent(room.id, activeFile.id, value)
  }


  const canEditFile = (file: RoomFile) => {
    const isOwner = file.ownerId === userId
    const isApprovedEditor = file.editors?.includes(userId)

    return isOwner || isApprovedEditor
  }

  return (
    <div
      className={cn(
        'h-full min-h-0 flex flex-col overflow-hidden bg-[#101624]',
        focusMode && 'fixed inset-0 z-50'
      )}
    >
      <div className="h-12 shrink-0 border-b border-white/10 bg-[#080d19]">
        <div className="flex h-full items-center justify-between gap-3 px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap">
            {files.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/40">
                <FileCode2 className="h-3.5 w-3.5" />
                No files
              </div>
            ) : (
              files.map((file) => {
                const isActive = file.id === activeFileId

                return (
                  <div
                    key={file.id}
                    className={cn(
                      'group shrink-0 flex items-center gap-1 rounded-xl border px-2 py-1.5 text-xs font-medium transition-all',
                      isActive
                        ? 'border-blue-500/60 bg-blue-500/10 text-white shadow-sm'
                        : 'border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.07] hover:text-white'
                    )}
                  >
                    <button
                      onClick={() => setActiveFileId(file.id)}
                      className="flex min-w-0 items-center gap-2"
                      title={file.name}
                    >
                      <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[140px] truncate font-mono">
                        {file.name}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                      className={cn(
                        'rounded-md p-0.5 transition',
                        isActive
                          ? 'opacity-100 hover:bg-red-500/20'
                          : 'opacity-0 group-hover:opacity-100 hover:bg-red-500/20'
                      )}
                      title={`Close ${file.name}`}
                    >
                      <X className="h-3.5 w-3.5 text-white/40 hover:text-red-400" />
                    </button>
                    {((file.ownerId ?? room.hostId) === userId || userId === room.hostId) &&
                      (file.visibility ?? 'host_public') !== 'host_public' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareFile(file.id)
                          }}
                          className="rounded px-1 text-[10px] text-white/40 hover:bg-white/10 hover:text-white"
                          title="Share file"
                        >
                          <SquareArrowOutUpRight size={15} />
                        </button>
                      )}
                    {activeFile && !canEditFile(activeFile) && (
                      <button
                        onClick={() =>
                          requestFileEditPermission(
                            room.id,
                            activeFile.id,
                            userId,
                            'Student'
                          )
                        }
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Request Edit
                      </button>
                    )}
                    {activeFile?.ownerId === userId &&
                      activeFile.editRequests
                        ?.filter((request) => request.status === 'pending')
                        .map((request) => (
                          <button
                            key={request.uid}
                            onClick={() =>
                              approveFileEditPermission(room.id, activeFile.id, request.uid)
                            }
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Approve {request.displayName}
                          </button>
                        ))}
                    {userId === room.hostId &&
                      (file.visibility ?? 'host_public') === 'host_public' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFileVisibility(file.id)
                          }}
                          className="rounded px-1 text-[10px] text-white/40 hover:bg-white/10 hover:text-white"
                          title={file.isVisible === false ? 'Show file' : 'Hide file'}
                        >
                          {file.isVisible === false ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>
                      )}
                  </div>
                )
              })
            )}

            <button
              onClick={createNewFile}
              className="shrink-0 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              title="Create new file"
            >
              <Plus className="h-3.5 w-3.5" />
              New File
            </button>
          </div>

          <button
            onClick={() => setFocusMode((prev) => !prev)}
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            title={focusMode ? 'Exit focus mode' : 'Focus mode'}
          >
            {focusMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="h-12 shrink-0 border-b border-white/10 bg-[#0b1020]">
        <div className="flex h-full items-center justify-between gap-3 px-3">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={runCode}
              disabled={running}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {running ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {running ? 'Running' : 'Run'}
            </button>

            <button
              onClick={() => setShowOutput((prev) => !prev)}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Terminal className="h-4 w-4" />
              {showOutput ? 'Hide Output' : 'Show Output'}
              {showOutput ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              onClick={copyCode}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <div className="hidden md:flex h-8 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50">
              <FileCode2 className="h-3.5 w-3.5" />
              {language}
            </div>
          </div>

          <div className="hidden lg:flex shrink-0 items-center gap-4 text-xs text-white/45">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {onlineCount} online
            </span>

            <span>Collaborative</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <MonacoEditor
          key={activeFile?.id}
          height="100%"
          language={language}
          value={activeFile?.content ?? '// Start coding...\n'}
          onChange={handleCodeChange}
          onMount={handleMount}
          options={{
            readOnly: activeFile ? !canEditFile(activeFile) : true,
            readOnlyMessage: {
              value: 'You need edit permission for this file.',
            },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 18, bottom: 18 },
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            smoothScrolling: true,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
            overviewRulerBorder: false,
          }}
        />
      </div>

      {showOutput && (
        <div className="h-36 shrink-0 border-t border-white/10 bg-[#070b14]">
          <div className="flex h-9 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Terminal className="h-3.5 w-3.5" />
              Output
            </div>

            <button
              onClick={resetOutput}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          <div className="h-[calc(9rem-2.25rem)] overflow-y-auto px-4 py-2 font-mono text-xs">
            {output.map((line, index) => (
              <div
                key={index}
                className={cn('leading-6', {
                  'text-green-400': line.type === 'success',
                  'text-red-400': line.type === 'error',
                  'text-slate-400': line.type === 'info',
                })}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}