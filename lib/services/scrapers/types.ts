export interface IPOData {
  name: string
  sector: string
  registrar: string
  status: string
  issuePrice?: number
  lotSize?: number
  openDate?: Date
  closeDate?: Date
  allotmentDate?: Date
  listingDate?: Date
}

export interface IPOScraper {
  getActiveIPOs(): Promise<IPOData[]>
}
