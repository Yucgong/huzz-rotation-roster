import { format } from 'date-fns'
import Link from 'next/link'
import type { JournalEntry } from '@/lib/supabase'

const MOOD_LABELS: Record<string, string> = {
  '💛': 'happy', '🥺': 'missing you', '☁️': 'soft',
  '✨': 'grateful', '😂': 'funny', '🌙': 'cozy',
}

export default function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const date = new Date(entry.created_at)
  const preview = entry.content.slice(0, 140) + (entry.content.length > 140 ? '…' : '')

  return (
    <Link href={`/journal/${entry.id}`}>
      <div className="card-hover cursor-pointer group">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ink-muted">{format(date, 'MMM d, yyyy')}</span>
            {entry.mood && <span className="text-sm" title={MOOD_LABELS[entry.mood]}>{entry.mood}</span>}
          </div>
          <span className="section-label text-[10px] bg-cream-100 px-2 py-0.5 rounded-full">{entry.author}</span>
        </div>
        <h3 className="font-serif text-lg font-medium text-ink mb-1 group-hover:text-rose-warm transition-colors">{entry.title}</h3>
        <p className="text-sm text-ink-light font-sans leading-relaxed">{preview}</p>
      </div>
    </Link>
  )
}