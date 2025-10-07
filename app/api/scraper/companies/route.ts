import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { redis } from '@/lib/redis'

const execAsync = promisify(exec)

// Scrape companies from specific registrar or all
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrar } = body // optional, if not provided scrapes all

    const scriptsPath = path.join(process.cwd(), 'scrapers')
    const pythonPath = path.join(scriptsPath, 'venv', 'bin', 'python')
    const mainScript = path.join(scriptsPath, 'main.py')

    const env = {
      ...process.env,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      HEADLESS_BROWSER: 'true',
    }

    let command = `${pythonPath} ${mainScript}`

    if (registrar) {
      command += ` scrape-companies --registrar=${registrar}`
    } else {
      command += ` scrape-all`
    }

    console.log(`Scraping companies: ${registrar || 'all'}`)

    const { stdout, stderr } = await execAsync(command, {
      cwd: scriptsPath,
      env,
      timeout: 120000, // 2 minute timeout
    })

    if (stderr && !stderr.includes('Scraping')) {
      console.error('Scraper stderr:', stderr)
    }

    const result = stdout ? JSON.parse(stdout) : {}

    return NextResponse.json({
      success: true,
      data: result,
      logs: stderr,
    })
  } catch (error: any) {
    console.error('Company scraping error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape companies',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// Get cached companies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const registrar = searchParams.get('registrar')

    const cacheKey = registrar
      ? `ipo:companies:${registrar}`
      : 'ipo:companies:active'

    const companies = await redis.get(cacheKey)

    if (!companies) {
      return NextResponse.json({
        success: false,
        message: 'No cached data found. Trigger a scrape first.',
        data: [],
      })
    }

    return NextResponse.json({
      success: true,
      data: companies,
      cached: true,
    })
  } catch (error: any) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
