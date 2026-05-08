import { supabase } from '@/lib/supabase'
import type { JournalEntry } from '@/lib/supabase'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

async function getEntry(id: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase.from('journal_entries').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const entry = await getEntry(id)
    if (!entry) notFound()

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <div className="animate-fade-up delay-100">
        <Link href="/journal" className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors text-sm mb-8">
          <ArrowLeft size={14} /> Journal
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-sm text-ink-muted">{format(new Date(entry.created_at), 'MMMM d, yyyy')}</span>
          {entry.mood && <span className="text-lg">{entry.mood}</span>}
          <span className="section-label text-[10px] bg-cream-100 px-2 py-0.5 rounded-full ml-auto">{entry.author}</span>
        </div>
        <h1 className="font-serif text-3xl font-medium text-ink mb-8">{entry.title}</h1>
        <div>
          {entry.content.split('\n').map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="font-sans text-ink-light leading-relaxed mb-4 text-base">{paragraph}</p>
            ) : <div key={i} className="mb-4" />
          )}
        </div>
        <div className="mt-12 pt-6 border-t border-cream-200">
          <Link href="/journal" className="btn-secondary inline-flex">← Back to journal</Link>
        </div>
      </div>
    </main>
  )
}