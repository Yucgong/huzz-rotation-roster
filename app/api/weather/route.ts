import { NextResponse } from 'next/server'

function describeWeather(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear' }
  if (code <= 2) return { emoji: '⛅', label: 'Partly cloudy' }
  if (code === 3) return { emoji: '☁️', label: 'Overcast' }
  if (code <= 49) return { emoji: '🌫️', label: 'Foggy' }
  if (code <= 59) return { emoji: '🌦️', label: 'Drizzle' }
  if (code <= 69) return { emoji: '🌧️', label: 'Rainy' }
  if (code <= 79) return { emoji: '❄️', label: 'Snowy' }
  if (code <= 82) return { emoji: '🌧️', label: 'Showers' }
  if (code <= 99) return { emoji: '⛈️', label: 'Thunderstorm' }
  return { emoji: '🌡️', label: 'Unknown' }
}

async function fetchWeather(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`
  const res = await fetch(url, { next: { revalidate: 1800 } })
  if (!res.ok) throw new Error('Weather fetch failed')
  return res.json()
}

export async function GET() {
  try {
    const [yourWeather, herWeather] = await Promise.all([
      fetchWeather(parseFloat(process.env.NEXT_PUBLIC_YOUR_LAT!), parseFloat(process.env.NEXT_PUBLIC_YOUR_LNG!)),
      fetchWeather(parseFloat(process.env.NEXT_PUBLIC_HER_LAT!), parseFloat(process.env.NEXT_PUBLIC_HER_LNG!)),
    ])

    return NextResponse.json({
      you: { city: process.env.NEXT_PUBLIC_YOUR_CITY, temp: Math.round(yourWeather.current.temperature_2m), ...describeWeather(yourWeather.current.weather_code), timezone: yourWeather.timezone },
      her: { city: process.env.NEXT_PUBLIC_HER_CITY, temp: Math.round(herWeather.current.temperature_2m), ...describeWeather(herWeather.current.weather_code), timezone: herWeather.timezone },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not load weather' }, { status: 500 })
  }
}