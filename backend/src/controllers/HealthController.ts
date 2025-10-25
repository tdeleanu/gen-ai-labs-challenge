import { Request, Response } from 'express'
import { ApiResponseHandler } from '../utils/apiResponse.js'
import { config } from '../config/environment.js'
import { sessionService } from '../services/SessionService.js'

export class HealthController {
  public async getHealth(_req: Request, res: Response): Promise<Response> {
    return ApiResponseHandler.success(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      activeSessions: sessionService.getSessionCount(),
      uptime: process.uptime(),
    })
  }
}

export const healthController = new HealthController()
