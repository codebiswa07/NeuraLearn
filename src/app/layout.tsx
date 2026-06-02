import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NeuraLearn', template: '%s | NeuraLearn' },
  description: 'AI-Powered Learning Management System with Real-Time Collaborative Coding',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = JSON.parse(localStorage.getItem('neuralearn-store') || '{}')?.state?.theme
            if (t === 'dark') document.documentElement.classList.add('dark')
          } catch {}
        `}} />
        {children}
        <Toaster position="top-right" toastOptions={{
          className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-slate-200 dark:!border-slate-800 !shadow-card-lg',
          duration: 3000,
        }} />
      </body>
    </html>
  )
}
