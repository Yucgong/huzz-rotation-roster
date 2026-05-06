import Link from 'next/link'
import WeatherCard from '@/components/WeatherCard' //'@/components/WeatherCard'
import CountdownCard from '@/components/CountdownCard' // '@/components/CountdownCard'
import ThoughtCard from '@/components/ThoughtCard'  //'@/components/ThoughtCard'
import { supabase } from '@/lib/supabase' 
import type { JournalEntry } from '@/lib/supabase' 
import JournalEntryCard from '@/components/JournalEntryCard'
import { BookOpen, PenLine } from 'lucide-react'

async function getRecentEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }
  return data || []
}

export default async function Home() {
  const recentEntries = await getRecentEntries()
  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'you'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'her'

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <header className="mb-10 animate-fade-up delay-100">
        <p className="section-label mb-1">huzz rotation roster</p>
        <h1 className="font-serif text-4xl font-medium text-ink">
          {herName} 
        </h1>
        <p className="text-ink-muted font-sans text-sm mt-1">
          Get your money up, not your funny up.
        </p>
      </header>

      <section className="space-y-4 mb-10">
        <WeatherCard />
        <CountdownCard />
        <ThoughtCard />
      </section>

      <section className="animate-fade-up delay-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-ink-muted" />
            <p className="section-label">recent entries</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/journal/new" className="btn-primary flex items-center gap-1.5">
              <PenLine size={13} />
              New entry
            </Link>
            <Link href="/journal" className="btn-secondary">
              See all
            </Link>
          </div>
        </div>

        {recentEntries.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-3xl mb-3">📖</p>
            <p className="font-serif text-ink text-lg mb-1">No entries yet</p>
            <p className="text-ink-muted text-sm mb-4">Write your first memory together.</p>
            <Link href="/journal/new" className="btn-primary inline-flex items-center gap-2">
              <PenLine size={13} />
              Write something
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}