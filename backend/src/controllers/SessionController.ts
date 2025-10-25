import { Request, Response } from 'express'
import { sessionService } from '../services/SessionService.js'
import { ApiResponseHandler } from '../utils/apiResponse.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('SessionController')

export class SessionController {
  /**
   * POST /api/session/create
   * Create a new session
   */
  public async createSession(_req: Request, res: Response): Promise<Response> {
    try {
      const session = await sessionService.createSession()

      return ApiResponseHandler.success(
        res,
        {
          sessionId: session.id,
          createdAt: session.createdAt,
        },
        'Session created successfully',
        201,
      )
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Failed to create session')
      return ApiResponseHandler.serverError(res, 'Failed to create session')
    }
  }

  /**
   * GET /api/session/validate/:sessionId
   * Validate if a session exists
   */
  public async validateSession(req: Request, res: Response): Promise<Response> {
    try {
      const { sessionId } = req.params

      if (!sessionService.validateSessionId(sessionId)) {
        return ApiResponseHandler.badRequest(res, 'Invalid session ID format')
      }

      const session = await sessionService.getSession(sessionId)

      if (!session) {
        return ApiResponseHandler.notFound(res, 'Session not found')
      }

      return ApiResponseHandler.success(res, {
        sessionId: session.id,
        valid: true,
        createdAt: session.createdAt,
        lastAccessedAt: session.lastAccessedAt,
      })
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Failed to validate session')
      return ApiResponseHandler.serverError(res, 'Failed to validate session')
    }
  }

  /**
   * GET /api/session/stats
   * Get session statistics
   */
  public async getStats(_req: Request, res: Response): Promise<Response> {
    try {
      const sessionCount = await sessionService.getSessionCount()

      return ApiResponseHandler.success(res, {
        activeSessions: sessionCount,
      })
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Failed to get stats')
      return ApiResponseHandler.serverError(res, 'Failed to get stats')
    }
  }
}

export const sessionController = new SessionController()
