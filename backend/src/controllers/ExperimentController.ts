import { Request, Response } from 'express'
import { experimentService } from '../services/ExperimentService.js'
import { createLogger } from '../utils/logger.js'
import { validateString, validateParameterRanges, validateUUID, ValidationError } from '../lib/validation.js'
import { ApiResponseHandler } from '../utils/apiResponse.js'

const logger = createLogger('ExperimentController')

export class ExperimentController {
  /**
   * Create a new experiment with 4 LLM responses
   * POST /api/experiments
   */
  async createExperiment(req: Request, res: Response): Promise<void> {
    try {
      // Validate session ID from header
      const sessionId = req.headers['x-session-id']
      if (!sessionId || typeof sessionId !== 'string') {
        ApiResponseHandler.error(res, 'Session ID is required in X-Session-ID header', 401)
        return
      }

      const validSessionId = validateUUID(sessionId, 'Session ID')

      // Validate and sanitize prompt
      const prompt = validateString(req.body.prompt, 'prompt', 1, 5000)

      // Validate and sanitize parameter ranges
      const parameters = validateParameterRanges(req.body.parameters || req.body)

      logger.info(
        {
          sessionId: validSessionId,
          promptLength: prompt.length,
          parameters,
        },
        'Creating experiment'
      )

      // Create experiment
      const experiment = await experimentService.createExperiment({
        sessionId: validSessionId,
        prompt,
        parameters,
      })

      ApiResponseHandler.success(res, experiment, 'Experiment created successfully', 201)
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.warn({ error: error.message }, 'Validation error')
        ApiResponseHandler.error(res, error.message, 400)
      } else {
        logger.error({ error }, 'Failed to create experiment')
        ApiResponseHandler.error(res, 'Failed to create experiment', 500)
      }
    }
  }

  /**
   * Get experiment by ID
   * GET /api/experiments/:id
   */
  async getExperiment(req: Request, res: Response): Promise<void> {
    try {
      // Validate session ID from header
      const sessionId = req.headers['x-session-id']
      if (!sessionId || typeof sessionId !== 'string') {
        ApiResponseHandler.error(res, 'Session ID is required in X-Session-ID header', 401)
        return
      }

      const validSessionId = validateUUID(sessionId, 'Session ID')
      const experimentId = validateUUID(req.params.id, 'Experiment ID')

      logger.info({ sessionId: validSessionId, experimentId }, 'Fetching experiment')

      const experiment = await experimentService.getExperiment(experimentId, validSessionId)

      if (!experiment) {
        ApiResponseHandler.error(res, 'Experiment not found', 404)
        return
      }

      ApiResponseHandler.success(res, experiment, 'Experiment retrieved successfully')
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.warn({ error: error.message }, 'Validation error')
        ApiResponseHandler.error(res, error.message, 400)
      } else {
        logger.error({ error }, 'Failed to fetch experiment')
        ApiResponseHandler.error(res, 'Failed to fetch experiment', 500)
      }
    }
  }

  /**
   * Get experiment history for session
   * GET /api/experiments/history
   */
  async getExperimentHistory(req: Request, res: Response): Promise<void> {
    try {
      // Validate session ID from header
      const sessionId = req.headers['x-session-id']
      if (!sessionId || typeof sessionId !== 'string') {
        ApiResponseHandler.error(res, 'Session ID is required in X-Session-ID header', 401)
        return
      }

      const validSessionId = validateUUID(sessionId, 'Session ID')

      logger.info({ sessionId: validSessionId }, 'Fetching experiment history')

      const experiments = await experimentService.getExperimentHistory(validSessionId)

      ApiResponseHandler.success(res, experiments, 'Experiment history retrieved successfully')
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.warn({ error: error.message }, 'Validation error')
        ApiResponseHandler.error(res, error.message, 400)
      } else {
        logger.error({ error }, 'Failed to fetch experiment history')
        ApiResponseHandler.error(res, 'Failed to fetch experiment history', 500)
      }
    }
  }
}

export const experimentController = new ExperimentController()
