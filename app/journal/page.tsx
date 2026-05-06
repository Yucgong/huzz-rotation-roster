import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { JournalEntry } from '@/lib/supabase'
import JournalEntryCard from  '@/components/JournalEntryCard'
import { ArrowLeft, PenLine } from 'lucide-react'

export const revalidate = 0

async function getAllEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error.message); return [] }
  return data || []
}

export default async function JournalPage() {
  const entries = await getAllEntries()

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-up delay-100">
        <div>
          <Link href="/" className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors text-sm mb-2">
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="font-serif text-3xl font-medium text-ink">Our Journal</h1>
          <p className="text-ink-muted text-sm mt-1">{entries.length} {entries.length === 1 ? 'memory' : 'memories'} so far</p>
        </div>
        <Link href="/journal/new" className="btn-primary flex items-center gap-2">
          <PenLine size={13} /> New entry
        </Link>
      </div>

      <section className="animate-fade-up delay-200">
        {entries.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-4xl mb-3">📖</p>
            <p className="font-serif text-ink text-xl mb-1">The journal is empty</p>
            <p className="text-ink-muted text-sm mb-5">Every great story starts with a first page.</p>
            <Link href="/journal/new" className="btn-primary inline-flex items-center gap-2">
              <PenLine size={13} /> Write your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)}
          </div>
        )}
      </section>
    </main>
  )
}