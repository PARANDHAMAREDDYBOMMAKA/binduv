import axios from 'axios'
import * as cheerio from 'cheerio'
import type { IPOData, IPOScraper } from './types'

export class BigshareIPOScraper implements IPOScraper {
  private baseUrl = 'https://www.bigshareonline.com/ipo_allotment_status.aspx'

  async getActiveIPOs(): Promise<IPOData[]> {
    try {
      console.log('Fetching IPOs from Bigshare:', this.baseUrl)

      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000,
      })

      const $ = cheerio.load(response.data)
      const ipos: IPOData[] = []

      // Bigshare typically has a dropdown for IPO selection
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
            registrar: 'bigshare',
            status: 'Active',
          })
        }
      })

      console.log(`Bigshare: Found ${ipos.length} IPOs`)
      return ipos
    } catch (error) {
      console.error('Error scraping Bigshare IPOs:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
      }
      return []
    }
  }
}
