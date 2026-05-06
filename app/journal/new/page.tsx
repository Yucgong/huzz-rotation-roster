'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Send } from 'lucide-react'

const MOODS = ['😹', '😈', '🍑', '💅', '🫦', '👏']

export default function NewEntryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState(process.env.NEXT_PUBLIC_YOUR_NAME || '')
  const [mood, setMood] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'You'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'Her'

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { setError('Please add a title and some content.'); return }
    setSaving(true)
    setError('')
    const { error: dbError } = await supabase.from('journal_entries').insert([{
      title: title.trim(), content: content.trim(), author: author || yourName, mood: mood || null,
    }])
    if (dbError) { setError('Something went wrong. Check your Supabase setup.'); setSaving(false); return }
    router.push('/journal')
    router.refresh()
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <div className="animate-fade-up delay-100">
        <Link href="/journal" className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors text-sm mb-6">
          <ArrowLeft size={14} /> Journal
        </Link>
        <h1 className="font-serif text-3xl font-medium text-ink mb-1">New Entry</h1>
        <p className="text-ink-muted text-sm mb-8">What nosy question do you have today?</p>
      </div>

      <div className="space-y-5 animate-fade-up delay-200">
        <div>
          <p className="section-label mb-2">Writing as</p>
          <div className="flex gap-2">
            {[yourName, herName].map((name) => (
              <button key={name} onClick={() => setAuthor(name)}
                className={`px-4 py-2 rounded-xl text-sm font-sans transition-all duration-150 ${
                  author === name ? 'bg-ink text-cream-50' : 'border border-cream-200 text-ink-light hover:border-ink-light'
                }`}>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label mb-2">Title</p>
          <input className="input-field font-serif text-lg" placeholder="Give this memory a name..."
            value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <p className="section-label mb-2">Entry</p>
          <textarea className="input-field resize-none font-sans leading-relaxed"
            placeholder="Write whatever you want. Nosy ass questions, head noise, how much you want to go to Knockout and see me..." rows={10}
            value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div>
          <p className="section-label mb-2">Mood (optional)</p>
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button key={m} onClick={() => setMood(mood === m ? '' : m)}
                className={`w-10 h-10 rounded-xl text-xl transition-all duration-150 ${
                  mood === m ? 'bg-rose-warm/20 ring-2 ring-rose-warm/40 scale-110' : 'bg-cream-100 hover:bg-cream-200'
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-rose-warm text-sm bg-rose-warm/10 rounded-xl px-4 py-3">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <Send size={13} /> {saving ? 'Saving…' : 'Save entry'}
          </button>
          <Link href="/journal" className="btn-secondary">Cancel</Link>
        </div>
      </div>
    </main>
  )
}