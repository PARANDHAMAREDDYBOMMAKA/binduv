import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrar, pan, companyValue, applicationNumber, dpId, clientId, url } = body

    if (!registrar || !pan) {
      return NextResponse.json(
        { error: 'Missing required fields: registrar and pan' },
        { status: 400 }
      )
    }

    const scriptsPath = path.join(process.cwd(), 'scrapers')
    const pythonPath = path.join(scriptsPath, 'venv', 'bin', 'python')
    const mainScript = path.join(scriptsPath, 'main.py')

    const env = {
      ...process.env,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      HEADLESS_BROWSER: 'true',
    }

    // Build command with arguments
    let command = `${pythonPath} ${mainScript} check-allotment --registrar=${registrar} --pan=${pan}`

    if (companyValue) command += ` --company-value="${companyValue}"`
    if (applicationNumber) command += ` --application-number="${applicationNumber}"`
    if (dpId) command += ` --dp-id="${dpId}"`
    if (clientId) command += ` --client-id="${clientId}"`
    if (url) command += ` --url="${url}"`

    console.log('Checking allotment with Python scraper...')

    const { stdout, stderr } = await execAsync(command, {
      cwd: scriptsPath,
      env,
      timeout: 60000, // 1 minute timeout
    })

    if (stderr) {
      console.error('Scraper stderr:', stderr)
    }

    const result = stdout ? JSON.parse(stdout) : {}

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Allotment check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check allotment',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
