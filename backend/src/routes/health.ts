import { Router } from 'express'
import { healthController } from '../controllers/HealthController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// GET /health - Health check
router.get('/', asyncHandler(healthController.getHealth.bind(healthController)))

export default router
