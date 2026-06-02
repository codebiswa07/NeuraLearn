'use client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Award, Download, Share2 } from 'lucide-react'

export default function CertificatesPage() {
  return (
    <div className="p-6 max-w-[900px] animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Certificates</h1>
      <p className="text-sm text-slate-500 mb-6">Your earned credentials</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earned cert */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-brand-200 dark:border-brand-800 bg-gradient-to-br from-white to-brand-50 dark:from-slate-900 dark:to-brand-950 p-8 text-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(37,99,235,.1) 20px, rgba(37,99,235,.1) 40px)' }} />
          <Award className="w-10 h-10 text-brand-600 mx-auto mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Certificate of Completion</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">System Design Mastery</h2>
          <p className="text-sm text-slate-500 mb-6">Awarded to <strong>Jordan Davis</strong> · May 2026</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="sm"><Download className="w-3.5 h-3.5" /> Download PDF</Button>
            <Button variant="secondary" size="sm"><Share2 className="w-3.5 h-3.5" /> Share</Button>
          </div>
        </div>

        {/* In progress */}
        <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed min-h-[280px]">
          <div className="text-4xl mb-4">📈</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Full-Stack Web Development</h2>
          <p className="text-sm text-slate-400 mb-4">68% complete · Keep going!</p>
          <Progress value={68} className="w-full mb-4" />
          <Button variant="secondary" size="sm">Continue Course →</Button>
        </Card>
      </div>
    </div>
  )
}
