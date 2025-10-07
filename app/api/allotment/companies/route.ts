import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

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

    // Use Python scrapers to fetch from all registrars
    console.log('No cached companies, fetching from registrars using Python scrapers...')

    const scriptsPath = path.join(process.cwd(), 'scrapers')
    const pythonPath = path.join(scriptsPath, 'venv', 'bin', 'python')
    const mainScript = path.join(scriptsPath, 'main.py')

    const env = {
      ...process.env,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      HEADLESS_BROWSER: 'true',
    }

    const { stdout, stderr } = await execAsync(
      `${pythonPath} ${mainScript} scrape-all`,
      {
        cwd: scriptsPath,
        env,
        timeout: 120000, // 2 minute timeout
      }
    )

    if (stderr) {
      console.log('Scraper logs:', stderr)
    }

    const scrapedData = stdout ? JSON.parse(stdout) : {}

    // Flatten all companies from all registrars
    const allCompanies = Object.values(scrapedData).flat()

    // Cache scraped data for 1 hour (3600 seconds)
    if (allCompanies.length > 0) {
      await redis.setex(cacheKey, 3600, allCompanies)
    }

    return NextResponse.json({
      companies: allCompanies,
      cached: false,
      source: 'python-scrapers',
      count: allCompanies.length,
      breakdown: {
        bigshare: scrapedData.bigshare?.length || 0,
        kfin: scrapedData.kfin?.length || 0,
        linkintime: scrapedData.linkintime?.length || 0,
      }
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
