import axios from 'axios'
import * as cheerio from 'cheerio'
import type { IPOData, IPOScraper } from './types'

export class LinkIntimeIPOScraper implements IPOScraper {
  private baseUrl = 'https://linkintime.co.in/initial_offer/public-issues.html'

  async getActiveIPOs(): Promise<IPOData[]> {
    try {
      console.log('Fetching IPOs from Link Intime:', this.baseUrl)

      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000,
      })

      const $ = cheerio.load(response.data)
      const ipos: IPOData[] = []

      // Link Intime lists IPOs in various formats
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

        // Clean up company name
        let companyName = text
          .replace(/\s+/g, ' ')
          .replace(/\(.*?\)/g, '')
          .trim()

        if (companyName && companyName.length > 3) {
          ipos.push({
            name: companyName,
            sector: 'General',
            registrar: 'link-intime',
            status: 'Active',
          })
        }
      })

      // Also check for IPO cards, tables, or links
      $('.ipo-item, .public-issue-item, table tr, a[href*="ipo"]').each((_, element) => {
        const $el = $(element)
        const text = $el.text().trim()

        // Look for company names
        const companyMatch = text.match(/([A-Z][a-zA-Z\s&]+(?:Limited|Ltd|Private|Pvt))/)
        if (companyMatch) {
          const companyName = companyMatch[1].trim()

          // Avoid duplicates
          if (!ipos.find(ipo => ipo.name === companyName)) {
            ipos.push({
              name: companyName,
              sector: 'General',
              registrar: 'link-intime',
              status: 'Active',
            })
          }
        }
      })

      console.log(`Link Intime: Found ${ipos.length} IPOs`)
      return ipos
    } catch (error) {
      console.error('Error scraping Link Intime IPOs:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
      }
      return []
    }
  }
}
