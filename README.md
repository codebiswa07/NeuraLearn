# NeuraLearn — AI-Powered LMS

A production-grade Learning Management System with real-time collaborative coding,
AI tutoring, quiz system, and full Firebase backend.

## Quick Start

### 1. Configure Firebase
- Create a Firebase project at https://console.firebase.google.com
- Enable: Authentication (Email + Google), Firestore, Storage, Realtime Database
- Copy your config values into `.env`

### 2. Configure AI
- Get your Anthropic API key from https://console.anthropic.com
- Add `AI_API_KEY` to `.env`

### 3. Run the app
```bash
npm run dev
```

### 4. Seed sample data (optional)
```bash
npx ts-node --skip-project src/lib/firebase/seed.ts
```

### 5. Run the WebSocket server (for collab coding)
```bash
npx ts-node --skip-project src/services/websocket/server.ts
```

## Architecture

```
Firebase Firestore    — Course, progress, quiz, certificates
Firebase Auth         — JWT-based multi-role auth (student/instructor/admin)
Firebase Storage      — Video uploads, resources, avatars
Firebase RTDB         — Cursor positions (low-latency collab signals)
Y.js + y-websocket    — CRDT-based conflict-free collaborative editing
Socket.io             — Presence, typing indicators, code run events
Anthropic Claude API  — AI Tutor via /api/ai streaming route
Piston API            — Code execution (TypeScript, Python, Go, Rust, C++)
Next.js App Router    — SSR + RSC + API routes
Zustand               — Global state + localStorage persistence
Tailwind CSS          — Utility-first styling with dark mode
```

## Key Features
- 🤖 AI Tutor (Claude-powered, streaming)
- 💻 Real-time collaborative code editor (Monaco + Y.js CRDT)
- 👥 Multi-user rooms with cursors, presence, and chat
- 📚 Course library with progress tracking
- ❓ Timed quiz system with auto-scoring
- 🏆 Certificate generation
- 🌗 Light/dark theme (persisted)
- 🔐 Role-based auth (student / instructor / admin)
- ▶️ Code execution (Piston API)
#

##[NeuraLearn](https://neuralearn-3pzg.onrender.com/)
