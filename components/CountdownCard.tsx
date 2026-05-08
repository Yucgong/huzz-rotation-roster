'use client'

import { useEffect, useState } from 'react'
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns'
import { Pencil, Check } from 'lucide-react'

const STORAGE_KEY = 'huzz_next_visit'

export default function CountdownCard() {
  const defaultDate = process.env.NEXT_PUBLIC_NEXT_VISIT || ''
  const [nextVisit, setNextVisit] = useState(defaultDate)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })
  const [mounted, setMounted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(defaultDate)

  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'you'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'her'

  // Load saved date from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setNextVisit(saved)
      setDraft(saved)
    }
    setMounted(true)
  }, [])

  // Countdown ticker
  useEffect(() => {
    if (!nextVisit) return
    const update = () => {
      const target = parseISO(nextVisit)
      const now = new Date()
      setTimeLeft({
        days: Math.max(0, differenceInDays(target, now)),
        hours: Math.max(0, differenceInHours(target, now) % 24),
        minutes: Math.max(0, differenceInMinutes(target, now) % 60),
      })
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [nextVisit])

  const saveDate = () => {
    if (!draft) return
    setNextVisit(draft)
    localStorage.setItem(STORAGE_KEY, draft)
    setEditing(false)
  }

  const isPast = mounted && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0

  return (
    <div className="card animate-fade-up delay-300">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">{isPast ? '🎉 CRACKED!' : 'Next sneaky link'}</p>
        <button
          onClick={() => setEditing(!editing)}
          className="text-ink-muted hover:text-ink transition-colors"
          title="Edit date"
        >
          <Pencil size={13} />
        </button>
      </div>

      {/* Editable date input */}
      {editing && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="date"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="input-field text-sm"
          />
          <button onClick={saveDate} className="btn-primary flex items-center gap-1.5 py-2">
            <Check size={13} /> Save
          </button>
        </div>
      )}

      {!mounted ? (
        <div className="h-16 bg-cream-100 rounded-xl animate-pulse" />
      ) : isPast ? (
        <p className="font-serif text-2xl text-ink">Nah Bruh</p>
      ) : (
        <>
          <div className="flex items-end gap-4">
            <div className="text-center">
              <p className="font-serif text-5xl font-medium text-ink leading-none">{timeLeft.days}</p>
              <p className="section-label mt-1">days</p>
            </div>
            <span className="font-serif text-3xl text-ink-muted mb-2">:</span>
            <div className="text-center">
              <p className="font-serif text-5xl font-medium text-ink leading-none">{String(timeLeft.hours).padStart(2, '0')}</p>
              <p className="section-label mt-1">hours</p>
            </div>
            <span className="font-serif text-3xl text-ink-muted mb-2">:</span>
            <div className="text-center">
              <p className="font-serif text-5xl font-medium text-ink leading-none">{String(timeLeft.minutes).padStart(2, '0')}</p>
              <p className="section-label mt-1">mins</p>
            </div>
          </div>
          <p className="text-ink-muted text-sm mt-4">Until {herName} gets CRACKED 👏</p>
        </>
      )}
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns'

// export default function CountdownCard() {
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })
//   const [mounted, setMounted] = useState(false)

//   const nextVisit = process.env.NEXT_PUBLIC_NEXT_VISIT || ''
//   const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'you'
//   const herName = process.env.NEXT_PUBLIC_HER_NAME || 'her'

//   useEffect(() => {
//     setMounted(true)
//     const update = () => {
//       const target = parseISO(nextVisit)
//       const now = new Date()
//       const days = differenceInDays(target, now)
//       const hours = differenceInHours(target, now) % 24
//       const minutes = differenceInMinutes(target, now) % 60
//       setTimeLeft({ days: Math.max(0, days), hours: Math.max(0, hours), minutes: Math.max(0, minutes) })
//     }
//     update()
//     const interval = setInterval(update, 60000)
//     return () => clearInterval(interval)
//   }, [nextVisit])

//   const isPast = mounted && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0

//   return (
//     <div className="card animate-fade-up delay-300">
//       <p className="section-label mb-4">{isPast ? '🎉 CRACKED!' : 'Next sneaky link'}</p>
//       {!mounted ? (
//         <div className="h-16 bg-cream-100 rounded-xl animate-pulse" />
//       ) : isPast ? (
//         <p className="font-serif text-2xl text-ink">Nah bruh</p>
//       ) : (
//         <>
//           <div className="flex items-end gap-4">
//             <div className="text-center">
//               <p className="font-serif text-5xl font-medium text-ink leading-none">{timeLeft.days}</p>
//               <p className="section-label mt-1">days</p>
//             </div>
//             <span className="font-serif text-3xl text-ink-muted mb-2">:</span>
//             <div className="text-center">
//               <p className="font-serif text-5xl font-medium text-ink leading-none">{String(timeLeft.hours).padStart(2, '0')}</p>
//               <p className="section-label mt-1">hours</p>
//             </div>
//             <span className="font-serif text-3xl text-ink-muted mb-2">:</span>
//             <div className="text-center">
//               <p className="font-serif text-5xl font-medium text-ink leading-none">{String(timeLeft.minutes).padStart(2, '0')}</p>
//               <p className="section-label mt-1">mins</p>
//             </div>
//           </div>
//           <p className="text-ink-muted text-sm mt-4">Until {herName} gets CRACKED 👏</p>
//         </>
//       )}
//     </div>
//   )
// }