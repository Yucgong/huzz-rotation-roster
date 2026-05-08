'use client'

import { useUser } from './UserContext'

export default function UserSelect() {
  const { setUser } = useUser()

  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'You'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'Her'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <p className="section-label mb-2">welcome to</p>
        <h1 className="font-serif text-4xl font-medium text-ink mb-2">
          huzz rotation roster
        </h1>
        <p className="text-ink-muted text-sm">Who's visiting today?</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setUser(yourName)}
          className="group flex flex-col items-center gap-4 card-hover px-10 py-8 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-ink/10 flex items-center justify-center
                          group-hover:bg-ink/20 transition-colors text-2xl font-serif font-medium text-ink">
            {yourName[0]}
          </div>
          <p className="font-serif text-lg text-ink">{yourName}</p>
        </button>

        <button
          onClick={() => setUser(herName)}
          className="group flex flex-col items-center gap-4 card-hover px-10 py-8 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-rose-warm/20 flex items-center justify-center
                          group-hover:bg-rose-warm/30 transition-colors text-2xl font-serif font-medium text-ink">
            {herName[0]}
          </div>
          <p className="font-serif text-lg text-ink">{herName}</p>
        </button>
      </div>
    </div>
  )
}