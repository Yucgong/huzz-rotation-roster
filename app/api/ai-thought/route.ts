import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const client = new Anthropic()

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  try {
    // Check if we already have a question for today
    const { data: existing } = await supabase
      .from('daily_question')
      .select('question')
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json({ thought: existing.question })
    }

    // No question yet for today — generate one
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: 
        `Today's date is ${today}. Generate a single fun daily activity or challenge for an early-stage long distance couple (not yet officially boyfriend and girlfriend) to do together or in parallel today.

        The activity should:
        - Be low-effort and doable from anywhere with just a phone
        - Feel spontaneous, playful, or intimate — not forced or cheesy
        - Involve both people doing something in parallel, sharing something, or creating something together
        - Vary in type: some days a photo challenge, some days a voice memo, a mini game, a creative prompt, a shared ritual, or a small dare
        - Occasionally be silly or lighthearted, occasionally tender or quietly romantic
        - Help them feel present in each other's day despite the distance
        
        Examples of the tone and style (do not reuse these):
        - "Step outside right now and photograph the sky above you. Send it at the same time. You're under the same one."
        - "Send a voice memo of whatever's in your head at this exact moment. No editing, no do-overs."
        - "Draw something in under 2 minutes and send it. Let them guess what it is."
        
        Return ONLY the activity itself as 1–2 short sentences. No title, no label, no explanation — just the prompt they'd send each other.`,
      }],
    })

    const question = (message.content[0] as { type: string; text: string }).text.trim()

    // Save to Supabase so every subsequent load today uses this same question
    await supabase.from('daily_question').insert([{ date: today, question }])

    return NextResponse.json({ thought: question })
  } catch (err) {
    console.error('AI question unavailable, using fallback.')
    const fallbacks = [
      "What's a small moment from your childhood that still makes you smile?",
      "If you could live anywhere in the world for a year, where would it be and why?",
      "What's something you're currently learning about yourself?",
      "What does your ideal ordinary Tuesday look like, ten years from now?",
      "What's a belief you held five years ago that you no longer hold?",
    ]
    return NextResponse.json({ thought: fallbacks[new Date().getDate() % fallbacks.length] })
  }
}

// Previous prompt ideas:
        // `Today's date is ${today}. Generate a single thought-provoking "question of the day" for a early stage (Not officially boyfriend and girlfriend) long distance relationship to ask each other.

        // The question should:
        // - Be deep and meaningful, helping them understand different outlooks on life, values
        // - Explore values, memories, fears, or hopes
        // - Does not have to be relationship-focused, can be about life in general, but should help them understand each other better
        // - Be open-ended with no right or wrong answer
        // - Feel intimate and can also be uncomfortable
        // - Can also be scenario-based, to see how the other thinks and feels about certain situations and moral values
        
        // Return ONLY the question itself, nothing else.`,

// import { NextResponse } from 'next/server'
// import Anthropic from '@anthropic-ai/sdk'

// const client = new Anthropic()

// export async function GET() {
//   try {
//     const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'you'
//     const herName = process.env.NEXT_PUBLIC_HER_NAME || 'her'

//     const message = await client.messages.create({
//       model: 'claude-opus-4-5',
//       max_tokens: 120,
//       messages: [{
//         role: 'user',
//         content: `Generate funny pro-feminist/anti-period message for ${herName} as she is about to have her period message like "${herName}, I can literally feel the anger come in me when thinking about how period cramp exists", "You are pregnant, ${herName}", etc. 1-2 sentences only. Funny but tasteful, not overly offensive and a bit supportive. Return ONLY the thought, nothing else.`,
//         // content: `Generate a light mean message like "${herName}, you should use more deodorant", "Bet you're with your other boys", "Halloween is over, ${herName}, you can take your mask off" teasing her or any words of discouragement directed at ${herName}. 1-2 sentences only. Mean but tasteful, not overly offensive. Return ONLY the thought, nothing else.`,
//       }],
//     })

//     const thought = (message.content[0] as { type: string; text: string }).text.trim()
//     return NextResponse.json({ thought })
//   } catch (err) {
//     console.error(err)
//     const fallbacks = [
//       'You should use some Deodorant.',
//       'Come over x.',
//       'I bet you\'re with your other hoes.',
//     ]
//     return NextResponse.json({ thought: fallbacks[Math.floor(Math.random() * fallbacks.length)] })
//   }
// }