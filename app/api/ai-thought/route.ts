import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function GET() {
  try {
    const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'you'
    const herName = process.env.NEXT_PUBLIC_HER_NAME || 'her'

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `Generate a light mean message like "You should use more deodorant", "Bet you're with your other boys", teasing her that she's with another boy or any words of discouragement directed at ${herName}. 1-2 sentences only. Mean but tasteful, not overly offensive. Return ONLY the thought, nothing else.`,
      }],
    })

    const thought = (message.content[0] as { type: string; text: string }).text.trim()
    return NextResponse.json({ thought })
  } catch (err) {
    console.error(err)
    const fallbacks = [
      'You should use some Deodorant.',
      'Come over x.',
      'I bet you\'re with your other hoes.',
    ]
    return NextResponse.json({ thought: fallbacks[Math.floor(Math.random() * fallbacks.length)] })
  }
}