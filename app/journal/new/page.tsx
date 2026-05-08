'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Send, ImagePlus, X } from 'lucide-react'
import { useUser } from '@/components/UserContext'
import { useEffect } from 'react'

const MOODS = ['😹', '😈', '🍑', '💅', '🫦', '👏']

export default function NewEntryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
//   const [author, setAuthor] = useState(process.env.NEXT_PUBLIC_YOUR_NAME || '')
  const { user } = useUser()
  const [author, setAuthor] = useState('')
  const [mood, setMood] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'You'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'Her'
  
  useEffect(() => {
    if (user) setAuthor(user)
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please add a title and some content.')
      return
    }
    setSaving(true)
    setError('')

    let photo_url = null

    if (photo) {
      const ext = photo.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('journal-photos')
        .upload(filename, photo)

      if (uploadError) {
        setError('Photo upload failed. Try again or submit without a photo.')
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('journal-photos')
        .getPublicUrl(filename)

      photo_url = urlData.publicUrl
    }

    const { error: dbError } = await supabase.from('journal_entries').insert([{
      title: title.trim(),
      content: content.trim(),
      author: author || yourName,
      mood: mood || null,
      photo_url,
    }])

    if (dbError) {
      setError('Something went wrong saving your entry. Check your Supabase setup.')
      setSaving(false)
      return
    }

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
        {/* Author */}
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

        {/* Title */}
        <div>
          <p className="section-label mb-2">Title</p>
          <input className="input-field font-serif text-lg" placeholder="Give this memory a name..."
            value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Content */}
        <div>
          <p className="section-label mb-2">Entry</p>
          <textarea className="input-field resize-none font-sans leading-relaxed"
            placeholder="Write whatever you want. Nosy ass questions, head noise, things you want to do, how much you want to go to Knockout and see me..." rows={10}
            value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        {/* Photo upload */}
        <div>
          <p className="section-label mb-2">Photo (optional)</p>
          {photoPreview ? (
            <div className="relative inline-block">
              <img src={photoPreview} alt="Preview" className="rounded-xl max-h-64 object-cover" />
              <button onClick={removePhoto}
                className="absolute top-2 right-2 bg-ink/70 text-cream-50 rounded-full p-1 hover:bg-ink transition-colors">
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 cursor-pointer w-fit border border-dashed border-cream-200 hover:border-ink-muted rounded-xl px-5 py-4 transition-colors">
              <ImagePlus size={18} className="text-ink-muted" />
              <span className="text-sm text-ink-muted font-sans">Add a photo to this memory</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          )}
        </div>

        {/* Mood */}
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

        {error && (
          <p className="text-rose-warm text-sm bg-rose-warm/10 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <Send size={13} />
            {saving ? (photo && !saving ? 'Uploading photo…' : 'Saving…') : 'Save entry'}
          </button>
          <Link href="/journal" className="btn-secondary">Cancel</Link>
        </div>
      </div>
    </main>
  )
}

// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import { ArrowLeft, Send } from 'lucide-react'

// const MOODS = ['😹', '😈', '🍑', '💅', '🫦', '👏']

// export default function NewEntryPage() {
//   const router = useRouter()
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [author, setAuthor] = useState(process.env.NEXT_PUBLIC_YOUR_NAME || '')
//   const [mood, setMood] = useState('')
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState('')

//   const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'You'
//   const herName = process.env.NEXT_PUBLIC_HER_NAME || 'Her'

//   const handleSubmit = async () => {
//     if (!title.trim() || !content.trim()) { setError('Please add a title and some content.'); return }
//     setSaving(true)
//     setError('')
//     const { error: dbError } = await supabase.from('journal_entries').insert([{
//       title: title.trim(), content: content.trim(), author: author || yourName, mood: mood || null,
//     }])
//     if (dbError) { setError('Something went wrong. Check your Supabase setup.'); setSaving(false); return }
//     router.push('/journal')
//     router.refresh()
//   }

//   return (
//     <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
//       <div className="animate-fade-up delay-100">
//         <Link href="/journal" className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors text-sm mb-6">
//           <ArrowLeft size={14} /> Journal
//         </Link>
//         <h1 className="font-serif text-3xl font-medium text-ink mb-1">New Entry</h1>
//         <p className="text-ink-muted text-sm mb-8">What nosy question do you have today?</p>
//       </div>

//       <div className="space-y-5 animate-fade-up delay-200">
//         <div>
//           <p className="section-label mb-2">Writing as</p>
//           <div className="flex gap-2">
//             {[yourName, herName].map((name) => (
//               <button key={name} onClick={() => setAuthor(name)}
//                 className={`px-4 py-2 rounded-xl text-sm font-sans transition-all duration-150 ${
//                   author === name ? 'bg-ink text-cream-50' : 'border border-cream-200 text-ink-light hover:border-ink-light'
//                 }`}>
//                 {name}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <p className="section-label mb-2">Title</p>
//           <input className="input-field font-serif text-lg" placeholder="Give this memory a name..."
//             value={title} onChange={(e) => setTitle(e.target.value)} />
//         </div>

//         <div>
//           <p className="section-label mb-2">Entry</p>
//           <textarea className="input-field resize-none font-sans leading-relaxed"
//             placeholder="Write whatever you want. Nosy ass questions, head noise, things you want to do, how much you want to go to Knockout and see me..." rows={10}
//             value={content} onChange={(e) => setContent(e.target.value)} />
//         </div>

//         <div>
//           <p className="section-label mb-2">Mood (optional)</p>
//           <div className="flex gap-2">
//             {MOODS.map((m) => (
//               <button key={m} onClick={() => setMood(mood === m ? '' : m)}
//                 className={`w-10 h-10 rounded-xl text-xl transition-all duration-150 ${
//                   mood === m ? 'bg-rose-warm/20 ring-2 ring-rose-warm/40 scale-110' : 'bg-cream-100 hover:bg-cream-200'
//                 }`}>
//                 {m}
//               </button>
//             ))}
//           </div>
//         </div>

//         {error && <p className="text-rose-warm text-sm bg-rose-warm/10 rounded-xl px-4 py-3">{error}</p>}

//         <div className="flex gap-3 pt-2">
//           <button onClick={handleSubmit} disabled={saving}
//             className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
//             <Send size={13} /> {saving ? 'Saving…' : 'Save entry'}
//           </button>
//           <Link href="/journal" className="btn-secondary">Cancel</Link>
//         </div>
//       </div>
//     </main>
//   )
// }