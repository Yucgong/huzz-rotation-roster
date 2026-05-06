'use client'

import { useEffect, useState } from 'react'

type WeatherData = {
  city: string
  temp: number
  emoji: string
  label: string
  timezone: string
}

type WeatherResponse = {
  you: WeatherData
  her: WeatherData
}

function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  return <span className="font-mono text-sm text-ink-muted">{time}</span>
}

function PersonWeather({ data, name, isYou }: { data: WeatherData; name: string; isYou: boolean }) {
  return (
    <div className={`flex-1 rounded-xl p-4 ${isYou ? 'bg-ink/5' : 'bg-rose-warm/10'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="section-label mb-1">{name}</p>
          <p className="font-serif text-lg font-medium text-ink">{data.city}</p>
        </div>
        <span className="text-3xl">{data.emoji}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-serif text-3xl font-medium text-ink">{data.temp}°</p>
          <p className="text-xs text-ink-muted mt-0.5">{data.label}</p>
        </div>
        <LocalTime timezone={data.timezone} />
      </div>
    </div>
  )
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || 'You'
  const herName = process.env.NEXT_PUBLIC_HER_NAME || 'Her'

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data) => { setWeather(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="card animate-fade-up delay-200">
      <p className="section-label mb-4">Weather Comparison</p>
      {loading ? (
        <div className="flex gap-3 h-28">
          <div className="flex-1 rounded-xl bg-cream-100 animate-pulse" />
          <div className="flex-1 rounded-xl bg-cream-100 animate-pulse" />
        </div>
      ) : weather ? (
        <div className="flex gap-3">
          <PersonWeather data={weather.you} name={yourName} isYou={true} />
          <div className="flex items-center">
            {/* <span className="text-ink-muted text-lg">♡</span> */}
          </div>
          <PersonWeather data={weather.her} name={herName} isYou={false} />
        </div>
      ) : (
        <p className="text-ink-muted text-sm">Could not load weather.</p>
      )}
    </div>
  )
}