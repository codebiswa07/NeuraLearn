import { cn } from '@/utils/cn'
import { initials, avatarColor } from '@/utils/formatters'
interface AvatarProps { name: string; uid?: string; photoURL?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }
const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
export function Avatar({ name, uid, photoURL, size = 'sm', className }: AvatarProps) {
  const bg = avatarColor(uid ?? name)
  return photoURL
    ? <img src={photoURL} alt={name} className={cn('rounded-full object-cover flex-shrink-0', sizes[size], className)} />
    : <div className={cn('rounded-full flex items-center justify-center font-bold text-white flex-shrink-0', sizes[size], className)} style={{ background: bg }}>{initials(name)}</div>
}
