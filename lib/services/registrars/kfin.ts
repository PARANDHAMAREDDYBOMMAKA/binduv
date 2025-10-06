import axios from 'axios'
import * as cheerio from 'cheerio'
import type { AllotmentRequest, AllotmentResponse, RegistrarService } from './types'

export class KFinService implements RegistrarService {
  private baseUrl = 'https://ipostatus.kfintech.com'

  async checkAllotment(request: AllotmentRequest): Promise<AllotmentResponse> {
    try {
      // KFin Technologies allotment check endpoint
      // This is a placeholder - actual implementation would require:
      // 1. Session handling
      // 2. CSRF token management
      // 3. Form submission with proper headers

      const response = await axios.post(
        `${this.baseUrl}/Status.aspx`,
        {
          pan: request.panNumber,
          dpid: request.dpId,
          clid: request.clientId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 10000,
        }
      )

      const $ = cheerio.load(response.data)

      // Parse the response HTML to extract allotment details
      // This is a simplified version - actual parsing would depend on KFin's HTML structure
      const statusText = $('.status-result').text().toLowerCase()

      if (statusText.includes('allotted') || statusText.includes('allot')) {
        const shares = this.extractNumber($('.shares').text()) || 0
        const amount = $('.amount').text().trim() || '₹0'

        return {
          status: 'allotted',
          shares,
          amount,
          refundAmount: '₹0',
          applicationNumber: request.applicationNumber || 'N/A',
          allotmentDate: new Date().toISOString().split('T')[0],
        }
      } else if (statusText.includes('not') || statusText.includes('unsuccessful')) {
        return {
          status: 'not_allotted',
          message: 'IPO was not allotted',
        }
      } else {
        return {
          status: 'pending',
          message: 'Allotment status is pending',
        }
      }
    } catch (error) {
      console.error('KFin allotment check error:', error)
      return {
        status: 'error',
        message: 'Unable to fetch allotment status from KFin Technologies',
      }
    }
  }

  private extractNumber(text: string): number | null {
    const match = text.match(/\d+/)
    return match ? parseInt(match[0], 10) : null
  }
}
