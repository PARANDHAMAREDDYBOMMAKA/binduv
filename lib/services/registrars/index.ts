import type { AllotmentRequest, AllotmentResponse, RegistrarService } from './types'
import { KFinService } from './kfin'
import { BigshareService } from './bigshare'
import { LinkIntimeService } from './linkintime'

export class RegistrarFactory {
  private static services: Map<string, RegistrarService> = new Map([
    ['kfin', new KFinService()],
    ['bigshare', new BigshareService()],
    ['link-intime', new LinkIntimeService()],
  ])

  static getService(registrar: string): RegistrarService {
    const service = this.services.get(registrar)
    if (!service) {
      throw new Error(`Unsupported registrar: ${registrar}`)
    }
    return service
  }

  static async checkAllotment(request: AllotmentRequest): Promise<AllotmentResponse> {
    const service = this.getService(request.registrar)
    return service.checkAllotment(request)
  }
}

export * from './types'
