import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function CodingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        {/* Coding Sidebar */}
        <aside className="hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <Sidebar />
        </aside>

        {/* Main Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Coding Topbar */}
          <header className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Topbar />
          </header>

          {/* Existing coding page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}