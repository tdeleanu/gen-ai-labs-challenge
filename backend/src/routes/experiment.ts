import { Router } from 'express'
import { experimentController } from '../controllers/ExperimentController.js'
import { asyncHandler } from '../utils/helpers.js'
import { experimentLimiter, historyLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Create new experiment with 4 LLM responses (strict rate limit - expensive operation)
router.post('/', experimentLimiter, asyncHandler(experimentController.createExperiment.bind(experimentController)))

// Get experiment history for session (MUST be before /:id) (moderate rate limit)
router.get('/history', historyLimiter, asyncHandler(experimentController.getExperimentHistory.bind(experimentController)))

// Get experiment by ID (dynamic route must come last) (moderate rate limit)
router.get('/:id', historyLimiter, asyncHandler(experimentController.getExperiment.bind(experimentController)))

export default router
