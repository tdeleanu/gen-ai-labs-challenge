import { Router } from 'express'
import healthRoutes from './health.js'
import sessionRoutes from './session.js'
import experimentRoutes from './experiment.js'

const router = Router()

// Health check
router.use('/health', healthRoutes)

// Session management
router.use('/api/session', sessionRoutes)

// Experiment management
router.use('/api/experiments', experimentRoutes)

export default router
