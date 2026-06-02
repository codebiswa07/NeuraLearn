'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { initialChatHistory } from '@/data/chatHistory'
import { topics } from '@/data/topics'
import { roadmapLevels } from '@/data/raodmap'
import { achievements } from '@/data/achivements'
import { platformStats } from '@/data/stats'
import { getAIResponse } from '@/data/aiResponses'

import type { TutorChatMessage } from '@/types'

export default function App() {
  const [currentTab, setCurrentTab] = useState<'brain' | 'code' | 'rocket'>('brain')
  const [activeTopic, setActiveTopic] = useState<string>('closures')
  const [learningProgress, setLearningProgress] = useState<number>(67)
  const [codeContent, setCodeContent] = useState<string>('// Select a topic to start coding...')
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Console idle. Ready to test.'])
  const [isCompiling, setIsCompiling] = useState<boolean>(false)
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false)
  const [chatInput, setChatInput] = useState<string>('')

  const [chatHistory, setChatHistory] =
    useState<Record<string, TutorChatMessage[]>>(initialChatHistory)

  useEffect(() => {
    if (topics[activeTopic]) {
      setCodeContent(topics[activeTopic].codeTemplate)
      setLearningProgress(topics[activeTopic].progress)
    }
  }, [activeTopic])

  const executeMockCode = () => {
    setIsCompiling(true)
    setConsoleLogs((prev) => [
      ...prev,
      '🔄 Initializing VM environment...',
      '📦 Parsing AST Tree...',
    ])

    setTimeout(() => {
      const outputLogs = topics[activeTopic]?.consoleOutput ?? [
        '✓ Code executed successfully.',
        '🎉 Learning progress updated.',
      ]

      setConsoleLogs((prev) => [...prev, ...outputLogs])
      setIsCompiling(false)
      setLearningProgress((prev) => Math.min(prev + 5, 100))
    }, 1500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg: TutorChatMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setChatHistory((prev) => ({
      ...prev,
      [activeTopic]: [...(prev[activeTopic] || []), userMsg],
    }))

    const query = chatInput.toLowerCase()
    setChatInput('')

    setTimeout(() => {
      const aiMsg: TutorChatMessage = {
        sender: 'ai',
        text: getAIResponse(activeTopic, query),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setChatHistory((prev) => ({
        ...prev,
        [activeTopic]: [...(prev[activeTopic] || []), aiMsg],
      }))
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#080718] text-slate-100 flex flex-col justify-between overflow-x-hidden relative font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[140px] animate-blob-spin" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[90px]" />
      </div>

      <style>{`
        @keyframes blob-spin {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.03); }
        }
        @keyframes liquid-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.25; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-blob-spin { animation: blob-spin 12s infinite ease-in-out; }
        .animate-float-slow { animation: float-slow 6s infinite ease-in-out; }
        .animate-float-medium { animation: float-medium 4s infinite ease-in-out; }
        .glass-bubble {
          background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.18), rgba(255,255,255,.04) 40%, rgba(0,0,0,.4));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,.25);
          box-shadow: inset 1px 1px 3px rgba(255,255,255,.4), inset -2px -2px 5px rgba(0,0,0,.5), 0 10px 25px rgba(0,0,0,.35);
        }
        .glass-panel {
          background: rgba(15,20,35,.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 12px 40px rgba(0,0,0,.3);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 99px; }
      `}</style>

      <header className="w-full z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0a091c]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neutral-700 to-teal-800 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <img src="/logo/Neuralearn.png" alt="NeuraLearn" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white uppercase">NeuraLearn</h1>
            <p className="text-[10px] text-fuchsia-400 font-medium">Next-Gen Workspace</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tutor Node Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-amber-400">🔥</span>
            <span>4 Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-sky-400">💎</span>
            <span>1,420 XP</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex items-center justify-center z-10">
        {currentTab === 'brain' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-[32px] relative overflow-hidden flex flex-col justify-between h-[520px]">
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
                <div className="absolute w-[280px] h-[280px] border border-fuchsia-500/15 rounded-full animate-pulse" />
                <div className="absolute w-[400px] h-[400px] border border-indigo-500/10 rounded-full" style={{ animation: 'ripple 8s infinite linear' }} />
                <div className="absolute w-[550px] h-[550px] border border-sky-500/5 rounded-full" style={{ animation: 'ripple 12s infinite linear' }} />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-transparent border border-white/10 rounded-full px-4 py-1.5 text-xs text-indigo-200">
                  <span className="text-amber-400">✨</span>
                  <span className="font-medium">AI-Powered Learning Platform</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mt-6 text-white max-w-xl">
                  Learn Faster with{' '}
                  <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                    AI Tutors
                  </span>
                  ,{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                    Coding Labs
                  </span>{' '}
                  & Real Projects
                </h2>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-5 max-w-lg">
                  Unleash fluid coding comprehension. Select core DSA, JavaScript, or React capsules and practice compiling interactive solutions in real time.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 relative z-10 mt-6">
                <Link href="/login">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 hover:from-fuchsia-500 hover:to-sky-400 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
                    Start Learning
                  </button>
                </Link>

                <Link href="/courses">
                  <button className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm border border-white/10 hover:border-white/20 transition-all active:scale-95">
                    Courses Available
                  </button>
                </Link>
              </div>

              <div className="relative z-10 mt-8 flex items-center">
                <div className="flex items-center gap-1.5 relative">
                  {platformStats.map((stat, index) => (
                    <React.Fragment key={stat.label}>
                      <div className="w-[84px] h-[84px] glass-bubble rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-105">
                        <span className="text-sm font-black text-transparent bg-gradient-to-b from-white to-slate-300 bg-clip-text">
                          {stat.value}
                        </span>
                        <span className="text-[9px] text-fuchsia-300 tracking-wider uppercase mt-0.5">
                          {stat.label}
                        </span>
                      </div>

                      {index < platformStats.length - 1 && (
                        <div className="w-5 h-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 blur-[1px] opacity-75" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center relative h-[520px] justify-center">
              <div className="absolute -top-4 -left-4 z-20 animate-float-slow">
                <div onClick={() => setCurrentTab('code')} className="glass-bubble rounded-full p-4 flex flex-col items-center justify-center w-24 h-24 text-center cursor-pointer hover:scale-105 transition-all">
                  <span className="text-[9px] uppercase tracking-widest text-pink-300 font-bold mb-1">Live Icon</span>
                  <span className="text-xl text-fuchsia-400">&lt;/&gt;</span>
                  <span className="text-[9px] text-slate-300 font-semibold mt-1">Code2</span>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 z-20 animate-float-medium">
                <div onClick={() => setCurrentTab('code')} className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-all">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-100">Live Coding</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 z-20 animate-float-slow">
                <div onClick={() => setShowTrophyModal(true)} className="glass-bubble rounded-full w-24 h-24 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all">
                  <span className="text-[8px] uppercase tracking-widest text-sky-300 font-bold mb-1">Achievements</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white text-base">
                    🏆
                  </div>
                  <span className="text-[9px] text-slate-300 font-semibold mt-1">Trophy</span>
                </div>
              </div>

              <div className="absolute left-[-48px] top-[32%] z-20 flex flex-col gap-3.5 items-start">
                {Object.values(topics).map((topic, i) => {
                  const isActive = activeTopic === topic.id

                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      style={{
                        transform: `rotate(${i * 1.5 - 1.5}deg) translateX(${isActive ? '12px' : '0px'})`,
                      }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 shadow-md ${
                        isActive
                          ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border-fuchsia-400'
                          : 'bg-[#121124]/90 backdrop-blur-md border-white/10 text-slate-300 hover:text-white hover:border-white/25'
                      }`}
                    >
                      {topic.name}
                    </button>
                  )
                })}
              </div>

              <div className="w-[88%] md:w-[92%] h-full bg-[#100f26]/40 backdrop-blur-3xl border border-white/15 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-7 relative">
                <div className="w-full flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-ping" />
                    <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-widest">
                      Active Neural Link
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    Modality: Flash-2.5
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center my-6 relative z-10">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-500 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] opacity-85 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-blob-spin" />
                    <div className="absolute w-20 h-20 rounded-full glass-bubble flex items-center justify-center text-4xl">
                      🧠
                    </div>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-white mt-3">AI Tutor Active</h3>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Heavy frosted glass terminal</p>

                  <div className="mt-4 bg-[#121128]/80 border border-white/5 rounded-2xl p-3.5 max-w-xs text-center shadow-inner">
                    <p className="text-[11px] text-indigo-200 leading-relaxed font-mono">
                      "{topics[activeTopic].aiExplanation}"
                    </p>
                  </div>
                </div>

                <div className="w-full relative z-10">
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 px-1 font-medium">
                    <span>Progress Bar</span>
                    <span className="text-sky-400 font-bold">{learningProgress}%</span>
                  </div>

                  <div className="w-full h-7 rounded-full bg-black/45 border border-white/10 relative overflow-hidden p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 relative transition-all duration-500 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                      style={{
                        width: `${learningProgress}%`,
                        backgroundSize: '200% 200%',
                        animation: 'liquid-flow 4s infinite linear',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      <span className="absolute right-2 top-1 w-1.5 h-1.5 rounded-full bg-white/60 animate-ping" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'code' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto items-stretch">
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center text-indigo-400 font-bold">
                      &lt;/&gt;
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">Live Code Lab</h3>
                      <p className="text-xs text-slate-400">Compile and analyze algorithms dynamically</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end">
                    {Object.values(topics).map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => setActiveTopic(topic.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                          activeTopic === topic.id
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-bold'
                            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl bg-slate-950/60 border border-white/5 p-4 overflow-hidden shadow-inner font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 select-none pb-2 border-b border-white/5">
                    <span className="text-indigo-400 font-semibold uppercase tracking-wider">
                      main.tsx
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      Virtual Environment
                    </span>
                  </div>

                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    rows={12}
                    className="w-full bg-transparent text-slate-200 font-mono focus:outline-none resize-none custom-scrollbar leading-relaxed"
                    spellCheck="false"
                  />

                  <div className="absolute right-4 bottom-4">
                    <button
                      onClick={executeMockCode}
                      disabled={isCompiling}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isCompiling ? 'Compiling...' : 'Execute Code'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs text-slate-400 min-h-[100px]">
                <div className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-semibold mb-2">
                  Virtual Terminal Logs
                </div>

                <div className="space-y-1 select-none">
                  {consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith('🎉') || log.startsWith('   ')
                          ? 'text-indigo-300'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl flex flex-col justify-between h-full min-h-[480px]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="pb-3 border-b border-white/5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h3 className="text-sm font-bold text-white capitalize">
                      {topics[activeTopic].name} Expert
                    </h3>
                  </div>

                  <div className="space-y-3.5 my-4 h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {(chatHistory[activeTopic] || []).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none border border-indigo-500/20'
                              : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                          }`}
                        >
                          {msg.text}
                        </div>

                        <span className="text-[9px] text-slate-500 mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="relative mt-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Tutor a question..."
                    className="w-full bg-slate-900/60 text-slate-200 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-indigo-500 shadow-inner"
                  />

                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white text-xs hover:opacity-90 active:scale-95 transition-all"
                  >
                    ➤
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'rocket' && (
          <div className="w-full glass-panel p-8 rounded-[32px] overflow-hidden min-h-[460px] flex flex-col justify-between relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-sky-400">
                  🚀
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">
                    Algorithm & Architecture Roadmap
                  </h3>
                  <p className="text-xs text-sky-300">
                    Level up your skill path through gamified milestones
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8 relative z-10">
                {roadmapLevels.map((item) => (
                  <div
                    key={item.level}
                    className={`bg-[#121124]/70 border border-white/5 rounded-2xl p-5 transition-all group flex flex-col justify-between ${
                      item.locked ? 'opacity-60 select-none' : 'hover:border-indigo-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] bg-indigo-400/10 text-indigo-300 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          Level {item.level}
                        </span>
                        {item.locked && <span>🔒</span>}
                      </div>

                      <h4 className="font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-400 mt-1.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                      <span>{item.locked ? 'Locked' : 'Progress'}</span>
                      <span className="text-indigo-400 font-bold">{item.progress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-950/20 border border-white/5 rounded-2xl text-center relative z-10 text-xs text-indigo-200">
              💡 Tip: Head back to the <strong>AI Tutor</strong> dashboard, click through topics, and finalize compiling exercises in the <strong>Code Lab</strong> to unlock the final roadmap modules!
            </div>
          </div>
        )}
      </main>

      {showTrophyModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel max-w-md w-full rounded-[32px] p-7 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex justify-between items-start pb-4 border-b border-white/5 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-black text-white text-lg">Your Achievements</h3>
                  <p className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                    Achievements Trophy
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTrophyModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className={`flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 items-center ${
                    achievement.locked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                    {achievement.icon}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-white">
                      {achievement.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTrophyModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:opacity-90 font-bold text-xs text-white transition-all shadow-md active:scale-95"
            >
              Back to Neural Deck
            </button>
          </div>
        </div>
      )}

      <footer className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 z-10">
        <div className="relative h-18 rounded-[24px] bg-white/5 border border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl p-1.5 flex items-center justify-between">
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-2.5 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-full blur-[2px] opacity-45 pointer-events-none" />

          <div className="w-full grid grid-cols-3 gap-2 relative z-10">
            {[
              { id: 'brain', label: 'Brain', icon: '🧠' },
              { id: 'code', label: 'Code2', icon: '</>' },
              { id: 'rocket', label: 'Rocket', icon: '🚀' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as 'brain' | 'code' | 'rocket')}
                className={`py-3.5 px-4 rounded-[18px] flex items-center justify-center gap-3 transition-all duration-300 ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-white shadow-inner border border-fuchsia-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="w-8 h-8 rounded-full glass-bubble flex items-center justify-center relative text-xs">
                  {tab.icon}
                </div>
                <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}