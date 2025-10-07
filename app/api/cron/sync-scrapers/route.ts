import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * Cron endpoint to sync all registrar data
 * Can be called by Vercel Cron or external cron service
 *
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-scrapers",
 *     "schedule": "0 *\/6 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON] Starting scraper sync...')

    const scriptsPath = path.join(process.cwd(), 'scrapers')
    const pythonPath = path.join(scriptsPath, 'venv', 'bin', 'python')
    const mainScript = path.join(scriptsPath, 'main.py')

    const env = {
      ...process.env,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      HEADLESS_BROWSER: 'true',
    }

    const startTime = Date.now()

    const { stdout, stderr } = await execAsync(
      `${pythonPath} ${mainScript} scrape-all`,
      {
        cwd: scriptsPath,
        env,
        timeout: 180000, // 3 minute timeout for cron
      }
    )

    const duration = Date.now() - startTime

    const result = stdout ? JSON.parse(stdout) : {}
    const totalCompanies = Object.values(result).flat().length

    console.log(`[CRON] Scraper sync completed in ${duration}ms. Found ${totalCompanies} companies.`)

    return NextResponse.json({
      success: true,
      message: 'Scraper sync completed',
      duration,
      totalCompanies,
      breakdown: {
        bigshare: result.bigshare?.length || 0,
        kfin: result.kfin?.length || 0,
        linkintime: result.linkintime?.length || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[CRON] Scraper sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync scrapers',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
