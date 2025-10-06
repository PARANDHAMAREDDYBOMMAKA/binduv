export interface IPODetails {
  companyName: string
  issueSize: string
  ipoPrice: string
  offerForSale: string
  freshIssue: string
  openDate: string
  closeDate: string
  status: IPOStatus
  ipoRegistrar: string
  marketLot: string
  minLotAmount: string
  listingAt: string
}

export interface IPOPostListing {
  companyName: string
  allotmentDate: string
  refundInitiation: string
  sharesCreditToDemat: string
  ipoListingDate: string
}

export type IPOStatus =
  | "Preparing draft"
  | "SEBI approved"
  | "Ready to IPO"
  | "On IPO"
  | "Allotment going on"
  | "Allotment completed"
  | "CLOSED"

export interface IPOPerformance {
  companyName: string
  symbol: string
  listingDate: string
  ipoPrice: number
  currentPrice: number
  gainPercent: number
  volume: number
  marketCap: string
  sector: string
}

export interface QuizOption {
  id: string
  companyName: string
  longterm: number
  shortterm: number
  notParticipating: number
  listingGains: number
}

export interface AllotmentCheck {
  registrar: string
  companyName: string
  panNumber: string
  applicationNumber?: string
  dpId?: string
  clientId?: string
}
