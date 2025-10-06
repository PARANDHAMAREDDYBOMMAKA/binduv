export interface AllotmentRequest {
  registrar: string
  companyName: string
  panNumber: string
  applicationNumber?: string
  dpId?: string
  clientId?: string
}

export interface AllotmentResponse {
  status: 'allotted' | 'not_allotted' | 'pending' | 'error'
  shares?: number
  amount?: string
  refundAmount?: string
  applicationNumber?: string
  allotmentDate?: string
  listingGains?: string
  gainPercentage?: string
  message?: string
}

export interface RegistrarService {
  checkAllotment(request: AllotmentRequest): Promise<AllotmentResponse>
}
