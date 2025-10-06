import type { IPOData, IPOScraper } from './types'
import { KFinIPOScraper } from './kfin-scraper'
import { BigshareIPOScraper } from './bigshare-scraper'
import { LinkIntimeIPOScraper } from './linkintime-scraper'

export class IPOScraperService {
  private scrapers: IPOScraper[] = [
    new KFinIPOScraper(),
    new BigshareIPOScraper(),
    new LinkIntimeIPOScraper(),
  ]

  async getAllActiveIPOs(): Promise<IPOData[]> {
    const results = await Promise.allSettled(
      this.scrapers.map(scraper => scraper.getActiveIPOs())
    )

    const allIPOs: IPOData[] = []

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allIPOs.push(...result.value)
      } else {
        console.error('Scraper failed:', result.reason)
      }
    })

    // Deduplicate IPOs by name
    const uniqueIPOs = allIPOs.reduce((acc, ipo) => {
      const existing = acc.find(i => i.name.toLowerCase() === ipo.name.toLowerCase())
      if (!existing) {
        acc.push(ipo)
      }
      return acc
    }, [] as IPOData[])

    return uniqueIPOs
  }

  async getIPOsByRegistrar(registrar: string): Promise<IPOData[]> {
    const allIPOs = await this.getAllActiveIPOs()
    return allIPOs.filter(ipo => ipo.registrar === registrar)
  }
}

export * from './types'
