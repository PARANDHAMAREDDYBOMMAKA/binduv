import axios from 'axios'
import * as cheerio from 'cheerio'
import type { IPOData, IPOScraper } from './types'

export class KFinIPOScraper implements IPOScraper {
  private baseUrl = 'https://ipostatus.kfintech.com'

  async getActiveIPOs(): Promise<IPOData[]> {
    try {
      console.log('Fetching IPOs from KFIN:', this.baseUrl)

      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 15000,
      })

      const $ = cheerio.load(response.data)
      const ipos: IPOData[] = []

      // KFIN uses dropdown for IPO selection
      // Look for select elements that contain IPO options
      $('select option').each((_, element) => {
        const $option = $(element)
        const text = $option.text().trim()
        const value = $option.attr('value') || ''

        // Skip empty, default, or placeholder options
        if (!text || !value || value === '0' || value === '' ||
            text.toLowerCase().includes('select') ||
            text.toLowerCase().includes('choose')) {
          return
        }

        // Parse company name and details
        let companyName = text
        let sector = 'General'

        // Clean up the company name
        companyName = companyName
          .replace(/\s+/g, ' ')
          .replace(/\(.*?\)/g, '') // Remove parentheses content
          .replace(/\-.*$/, '') // Remove everything after dash
          .trim()

        if (companyName && companyName.length > 3) {
          ipos.push({
            name: companyName,
            sector,
            registrar: 'kfin',
            status: 'Active',
          })
        }
      })

      // Also look for any table rows or list items containing IPO info
      $('table tr, ul li, .ipo-item').each((_, element) => {
        const $el = $(element)
        const text = $el.text().trim()

        // Look for company names in table cells or list items
        if (text && text.length > 10 && !text.toLowerCase().includes('select')) {
          const companyMatch = text.match(/([A-Z][a-zA-Z\s&]+(?:Limited|Ltd|Private|Pvt))/)
          if (companyMatch) {
            const companyName = companyMatch[1].trim()

            // Avoid duplicates
            if (!ipos.find(ipo => ipo.name === companyName)) {
              ipos.push({
                name: companyName,
                sector: 'General',
                registrar: 'kfin',
                status: 'Active',
              })
            }
          }
        }
      })

      console.log(`KFIN: Found ${ipos.length} IPOs`)
      return ipos
    } catch (error) {
      console.error('Error scraping KFin IPOs:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data?.substring(0, 200))
      }
      return []
    }
  }

  private extractNumber(text: string): number | null {
    const match = text.match(/\d+/)
    return match ? parseInt(match[0], 10) : null
  }
}
