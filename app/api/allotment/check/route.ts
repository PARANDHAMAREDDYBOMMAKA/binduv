import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { RegistrarFactory } from '@/lib/services/registrars'
import type { AllotmentRequest, AllotmentResponse } from '@/lib/services/registrars'

export async function POST(request: NextRequest) {
  try {
    const body: AllotmentRequest = await request.json()
    // Use Python scraper by default (more reliable)
    const usePythonScraper = request.nextUrl.searchParams.get('use_python') !== 'false'

    // Validate required fields
    if (!body.registrar || !body.companyName || !body.panNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create cache key based on request parameters
    const cacheKey = `allotment:${body.registrar}:${body.companyName}:${body.panNumber}:${body.applicationNumber || ''}:${body.dpId || ''}:${body.clientId || ''}`

    // Check Redis cache first
    const cachedResult = await redis.get<AllotmentResponse>(cacheKey)

    if (cachedResult) {
      console.log('Cache hit for:', cacheKey)
      return NextResponse.json({
        ...cachedResult,
        cached: true,
      })
    }

    console.log('Cache miss for:', cacheKey)

    let result: AllotmentResponse

    // Use Python scraper if requested (more reliable for production)
    if (usePythonScraper) {
      console.log('Using Python scraper for allotment check')
      const scraperResponse = await fetch(`${request.nextUrl.origin}/api/scraper/check-allotment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrar: body.registrar,
          pan: body.panNumber,
          companyValue: body.companyName,
          applicationNumber: body.applicationNumber,
          dpId: body.dpId,
          clientId: body.clientId,
        }),
      })

      const scraperData = await scraperResponse.json()
      result = scraperData.success ? scraperData.data : { status: 'error', message: scraperData.error }
    } else {
      // Use TypeScript-based scraper (fallback)
      result = await RegistrarFactory.checkAllotment(body)
    }

    // Cache the result for 5 minutes (300 seconds)
    // Only cache successful results
    if (result.status !== 'error') {
      await redis.setex(cacheKey, 300, result)
    }

    return NextResponse.json({
      ...result,
      cached: false,
      method: usePythonScraper ? 'python' : 'typescript',
    })
  } catch (error) {
    console.error('Allotment check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check allotment status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
