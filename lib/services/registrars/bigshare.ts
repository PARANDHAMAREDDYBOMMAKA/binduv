import axios from 'axios'
import * as cheerio from 'cheerio'
import type { AllotmentRequest, AllotmentResponse, RegistrarService } from './types'

export class BigshareService implements RegistrarService {
  private baseUrl = 'https://www.bigshareonline.com/ipo_allotment_status.aspx'

  async checkAllotment(request: AllotmentRequest): Promise<AllotmentResponse> {
    try {
      // Bigshare Services allotment check endpoint
      // This is a placeholder - actual implementation would require:
      // 1. Getting the IPO-specific endpoint
      // 2. Session and CAPTCHA handling
      // 3. Form submission with proper parameters

      const response = await axios.post(
        this.baseUrl,
        {
          __EVENTTARGET: '',
          __EVENTARGUMENT: '',
          txtPanNo: request.panNumber,
          DPId: request.dpId,
          ClientId: request.clientId,
          btnSubmit: 'Submit',
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
      const statusTable = $('#gvAllotmentDetails')

      if (statusTable.length > 0) {
        const shares = this.extractNumber($('td:contains("Shares Allotted")').next().text()) || 0
        const amount = $('td:contains("Amount")').next().text().trim() || '₹0'

        return {
          status: 'allotted',
          shares,
          amount,
          refundAmount: '₹0',
          applicationNumber: request.applicationNumber || 'N/A',
          allotmentDate: new Date().toISOString().split('T')[0],
        }
      } else {
        const errorMsg = $('.error-message').text() || $('.alert').text()

        if (errorMsg.toLowerCase().includes('not allotted')) {
          return {
            status: 'not_allotted',
            message: 'IPO was not allotted',
          }
        }

        return {
          status: 'pending',
          message: 'Allotment status is pending or unavailable',
        }
      }
    } catch (error) {
      console.error('Bigshare allotment check error:', error)
      return {
        status: 'error',
        message: 'Unable to fetch allotment status from Bigshare Services',
      }
    }
  }

  private extractNumber(text: string): number | null {
    const match = text.match(/\d+/)
    return match ? parseInt(match[0], 10) : null
  }
}
