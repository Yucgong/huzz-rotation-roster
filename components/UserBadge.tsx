'use client'

import { useUser } from './UserContext'
import { LogOut } from 'lucide-react'

export default function UserBadge() {
  const { user, clearUser } = useUser()

  if (!user) return null

  return (
    <div className="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
      <div className="w-6 h-6 rounded-full bg-ink/10 flex items-center justify-center
                      text-xs font-serif font-medium text-ink">
        {user[0]}
      </div>
      <span className="text-xs text-ink-muted font-sans">{user}</span>
      <button
        onClick={clearUser}
        title="Switch user"
        className="text-ink-muted hover:text-ink transition-colors ml-1"
      >
        <LogOut size={12} />
      </button>
    </div>
  )
}