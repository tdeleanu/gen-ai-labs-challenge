import { Request, Response, NextFunction } from 'express'
import { ApiResponseHandler } from '../utils/apiResponse.js'
import { createLogger } from '../utils/logger.js'

// Type for async route handlers (can be sync or async)
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void

const logger = createLogger('ErrorHandler')

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (err: Error | AppError, _req: Request, res: Response, _next: NextFunction) => {
  // Only log server errors (5xx) at ERROR level, client errors (4xx) already logged by middleware
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ error: err.message, stack: err.stack, statusCode: err.statusCode }, 'Server error')
    }
    return ApiResponseHandler.error(res, err.message, err.statusCode)
  }

  // Unknown errors - log at ERROR level
  logger.error({ error: err.message, stack: err.stack, name: err.name }, 'Unexpected error caught by middleware')

  if (err.name === 'ValidationError') {
    return ApiResponseHandler.badRequest(res, err.message)
  }

  if (err.name === 'UnauthorizedError') {
    return ApiResponseHandler.unauthorized(res, err.message)
  }

  return ApiResponseHandler.serverError(res, 'Internal server error')
}

export const notFoundHandler = (_req: Request, res: Response) => {
  return ApiResponseHandler.notFound(res, 'Route not found')
}

export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
