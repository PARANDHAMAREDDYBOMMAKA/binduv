import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { IPOScraperService } from '@/lib/services/scrapers'

export async function POST() {
  try {
    const scraperService = new IPOScraperService()

    console.log('Starting IPO sync from registrars...')

    // Fetch all active IPOs from registrars
    const ipos = await scraperService.getAllActiveIPOs()

    console.log(`Found ${ipos.length} IPOs`)

    if (ipos.length > 0) {
      // Store in Redis with 1 hour expiry
      const cacheKey = 'ipo:companies:active'
      await redis.setex(cacheKey, 3600, ipos)

      console.log('IPOs cached successfully')
    }

    return NextResponse.json({
      success: true,
      count: ipos.length,
      companies: ipos,
      message: `Successfully synced ${ipos.length} IPOs from registrars`,
    })
  } catch (error) {
    console.error('Error syncing IPOs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync IPOs from registrars',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
