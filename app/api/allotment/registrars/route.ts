import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// Dynamically detect available registrars based on scraped data
export async function GET() {
  try {
    const cacheKey = 'ipo:registrars:active'
    const cachedRegistrars = await redis.get(cacheKey)

    if (cachedRegistrars) {
      return NextResponse.json({
        registrars: cachedRegistrars,
        cached: true,
      })
    }

    // Get unique registrars from companies data
    const companiesCacheKey = 'ipo:companies:active'
    const companies = await redis.get<Array<{ registrar: string; name: string }>>(companiesCacheKey)

    const registrars = [
      { value: "kfin", label: "KFin Technologies", icon: "⚡", available: false },
      { value: "bigshare", label: "Bigshare Services", icon: "📊", available: false },
      { value: "link-intime", label: "Link Intime", icon: "🔗", available: false },
      { value: "mas", label: "MAS Services", icon: "🏢", available: false },
      { value: "skyline", label: "Skyline Financial", icon: "🏗️", available: false },
    ]

    // Mark registrars as available if they have active IPOs
    if (companies && Array.isArray(companies)) {
      const activeRegistrars = new Set(companies.map(c => c.registrar))

      registrars.forEach(reg => {
        if (activeRegistrars.has(reg.value)) {
          reg.available = true
        }
      })
    }

    // Only return registrars that have active IPOs
    const availableRegistrars = registrars.filter(r => r.available)

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, availableRegistrars)

    return NextResponse.json({
      registrars: availableRegistrars,
      cached: false,
    })
  } catch (error) {
    console.error('Error fetching registrars:', error)
    return NextResponse.json(
      {
        registrars: [],
        error: 'Failed to fetch registrars',
      },
      { status: 500 }
    )
  }
}
