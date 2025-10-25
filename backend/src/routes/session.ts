import { Router } from 'express'
import { sessionController } from '../controllers/SessionController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// POST /api/session/create - Create new session
router.post('/create', asyncHandler(sessionController.createSession.bind(sessionController)))

// GET /api/session/validate/:sessionId - Validate session
router.get('/validate/:sessionId', asyncHandler(sessionController.validateSession.bind(sessionController)))

// GET /api/session/stats - Get session stats
router.get('/stats', asyncHandler(sessionController.getStats.bind(sessionController)))

export default router
