import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { IPOScraperService } from '@/lib/services/scrapers'

export async function GET() {
  try {
    // Check cache first
    const cacheKey = 'ipo:companies:active'
    const cachedCompanies = await redis.get(cacheKey)

    if (cachedCompanies) {
      return NextResponse.json({
        companies: cachedCompanies,
        cached: true,
        source: 'cache',
      })
    }

    // Fetch ONLY from registrars - no database fallback
    console.log('No cached companies, fetching from registrars...')
    const scraperService = new IPOScraperService()
    const scrapedCompanies = await scraperService.getAllActiveIPOs()

    // Cache scraped data for 1 hour (3600 seconds)
    if (scrapedCompanies.length > 0) {
      await redis.setex(cacheKey, 3600, scrapedCompanies)
    }

    return NextResponse.json({
      companies: scrapedCompanies,
      cached: false,
      source: 'registrars',
      count: scrapedCompanies.length,
    })
  } catch (error) {
    console.error('Error fetching companies from registrars:', error)

    return NextResponse.json(
      {
        companies: [],
        error: 'Failed to fetch companies from registrars',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// No POST endpoint - all data comes from scrapers
