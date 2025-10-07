import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { redis } from '@/lib/redis'

const execAsync = promisify(exec)

// Trigger Python scraper to sync all registrars
export async function POST() {
  try {
    const scriptsPath = path.join(process.cwd(), 'scrapers')
    const pythonPath = path.join(scriptsPath, 'venv', 'bin', 'python')
    const mainScript = path.join(scriptsPath, 'main.py')

    // Load environment variables for Python script
    const env = {
      ...process.env,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      HEADLESS_BROWSER: 'true',
    }

    console.log('Starting scraper sync...')

    const { stdout, stderr } = await execAsync(
      `${pythonPath} ${mainScript} scrape-all`,
      {
        cwd: scriptsPath,
        env,
        timeout: 120000, // 2 minute timeout
      }
    )

    if (stderr && !stderr.includes('Scraping')) {
      console.error('Scraper stderr:', stderr)
    }

    const result = stdout ? JSON.parse(stdout) : {}

    // Clear registrars cache so it will be regenerated with new data
    await redis.del('ipo:registrars:active')

    return NextResponse.json({
      success: true,
      message: 'Scraper sync completed',
      data: result,
      logs: stderr,
    })
  } catch (error: any) {
    console.error('Scraper sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync scrapers',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// Get sync status
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to trigger scraper sync',
    endpoint: '/api/scraper/sync',
  })
}
