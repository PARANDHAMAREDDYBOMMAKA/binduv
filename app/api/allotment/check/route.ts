import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { RegistrarFactory } from '@/lib/services/registrars'
import type { AllotmentRequest, AllotmentResponse } from '@/lib/services/registrars'

export async function POST(request: NextRequest) {
  try {
    const body: AllotmentRequest = await request.json()

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

    // Fetch from registrar
    const result = await RegistrarFactory.checkAllotment(body)

    // Cache the result for 5 minutes (300 seconds)
    // Only cache successful results
    if (result.status !== 'error') {
      await redis.setex(cacheKey, 300, result)
    }

    return NextResponse.json({
      ...result,
      cached: false,
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
