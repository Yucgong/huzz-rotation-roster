'use client'

import { useEffect, useState } from 'react'

export default function ThoughtCard() {
  const [thought, setThought] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ai-thought')
      .then((r) => r.json())
      .then((data) => { setThought(data.thought); setLoading(false) })
      .catch(() => { setThought('Every day apart is a day closer to being together.'); setLoading(false) })
  }, [])

  return (
    <div className="card animate-fade-up delay-400 relative overflow-hidden">
      <span className="absolute top-3 right-5 font-serif text-7xl text-cream-200 leading-none select-none pointer-events-none">"</span>
      <p className="section-label mb-4">Question of the day</p>
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-cream-100 rounded animate-pulse w-full" />
          <div className="h-4 bg-cream-100 rounded animate-pulse w-4/5" />
        </div>
      ) : (
        <p className="font-serif text-lg italic text-ink leading-relaxed pr-8">{thought}</p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-6 h-px bg-cream-200" />
        <p className="section-label text-[10px]">generated with AI</p>
      </div>
    </div>
  )
}