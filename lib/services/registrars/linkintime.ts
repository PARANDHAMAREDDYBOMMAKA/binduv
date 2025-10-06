import axios from 'axios'
import * as cheerio from 'cheerio'
import type { AllotmentRequest, AllotmentResponse, RegistrarService } from './types'

export class LinkIntimeService implements RegistrarService {
  private baseUrl = 'https://linkintime.co.in/initial_offer/public-issues.html'

  async checkAllotment(request: AllotmentRequest): Promise<AllotmentResponse> {
    try {
      // Link Intime allotment check endpoint
      // This is a placeholder - actual implementation would require:
      // 1. Getting the IPO-specific endpoint
      // 2. Handling their specific form structure
      // 3. Session management

      const response = await axios.post(
        this.baseUrl,
        {
          pan: request.panNumber,
          appno: request.applicationNumber,
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
      const resultDiv = $('.result-container, .allotment-status')

      if (resultDiv.length > 0) {
        const statusText = resultDiv.text().toLowerCase()

        if (statusText.includes('allotted') || statusText.includes('successful')) {
          const shares = this.extractNumber($('.shares-allotted, td:contains("Shares")').next().text()) || 0
          const amount = $('.amount-paid, td:contains("Amount")').next().text().trim() || '₹0'

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
        }
      }

      return {
        status: 'pending',
        message: 'Allotment status is pending',
      }
    } catch (error) {
      console.error('Link Intime allotment check error:', error)
      return {
        status: 'error',
        message: 'Unable to fetch allotment status from Link Intime',
      }
    }
  }

  private extractNumber(text: string): number | null {
    const match = text.match(/\d+/)
    return match ? parseInt(match[0], 10) : null
  }
}
