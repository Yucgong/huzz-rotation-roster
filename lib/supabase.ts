import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type JournalEntry = {
  id: number
  created_at: string
  title: string
  content: string
  author: string
  mood?: string
  photo_url?: string  // ← new
}