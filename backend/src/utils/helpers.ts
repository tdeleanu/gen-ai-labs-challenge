import { Request, Response, NextFunction } from 'express'
import { createLogger } from './logger.js'

const logger = createLogger('Helpers')

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Sleep for a given number of seconds.
 *
 * @param {number}  seconds seconds to sleep for
 * @param {string=} reason reason for sleeping
 */
export function sleep(seconds: number, reason?: string): Promise<void> {
  logger.trace({ reason }, `Sleeping for ${seconds} sec...`)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}

/**
 * Generate a random number between two given numbers.
 * By default, the result is fixed to 2 digits after the decimal point.
 */
export function randBetween(min: number, max: number, decimalPlaces = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimalPlaces))
}

/**
 * Sanitize request body for logging by truncating large data.
 * @param body - The request body to sanitize
 * @returns A sanitized copy
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizeBodyForLogging = (body: any): any => {
  if (!body || typeof body !== 'object') return body

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized: any = Array.isArray(body) ? [] : {}

  for (const [key, value] of Object.entries(body)) {
    // Truncate very long strings
    if (typeof value === 'string' && value.length > 1000) {
      sanitized[key] = `[string: ${value.length} bytes]`
      continue
    }

    // Recursively sanitize nested objects
    if (value && typeof value === 'object') {
      sanitized[key] = sanitizeBodyForLogging(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
