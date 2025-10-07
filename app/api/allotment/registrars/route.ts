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
      { value: "kfin", label: "KFin Technologies", icon: "⚡", available: false, count: 0 },
      { value: "bigshare", label: "Bigshare Services", icon: "📊", available: false, count: 0 },
      { value: "linkintime", label: "Link Intime", icon: "🔗", available: false, count: 0 },
    ]

    // Mark registrars as available if they have active IPOs
    if (companies && Array.isArray(companies)) {
      const registrarCounts = companies.reduce((acc, company) => {
        const reg = company.registrar
        acc[reg] = (acc[reg] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      registrars.forEach(reg => {
        const count = registrarCounts[reg.value] || 0
        if (count > 0) {
          reg.available = true
          reg.count = count
        }
      })
    }

    // Return all registrars (show all, even if no active IPOs)
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, registrars)

    return NextResponse.json({
      registrars: registrars,
      cached: false,
      totalCompanies: companies?.length || 0,
      availableCount: registrars.filter(r => r.available).length,
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
