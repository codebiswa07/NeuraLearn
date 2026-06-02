import { formatDistanceToNow, format } from 'date-fns'

export const fmtRelative = (d: Date) => formatDistanceToNow(d, { addSuffix: true })
export const fmtDate     = (d: Date) => format(d, 'MMM d, yyyy')
export const fmtDuration = (mins: number) => mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`
export const fmtPct      = (n: number, d: number) => d === 0 ? '0%' : `${Math.round((n/d)*100)}%`
export const fmtStorage  = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`
  return `${(bytes/1048576).toFixed(1)} MB`
}
export const avatarColor = (uid: string) => {
  const colors = ['#2563eb','#7c3aed','#0d9488','#d97706','#dc2626','#059669']
  return colors[uid.charCodeAt(0) % colors.length]
}
export const initials = (name: string) => name.split(' ').map(p=>p[0]).join('').toUpperCase().slice(0,2)
