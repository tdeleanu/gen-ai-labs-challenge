import { rateLimit } from 'express-rate-limit'
import { Request, Response } from 'express'

/**
 * General rate limiter for all routes (80 requests per 15 minutes)
 * Protects against general abuse and DoS attacks
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 80, // Limit each IP to 80 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes',
      timestamp: new Date().toISOString(),
    })
  },
})

/**
 * Experiment creation rate limiter (15 requests per 5 minutes)
 * Stricter limit since experiment creation calls expensive LLM APIs
 * Each experiment generates 4 LLM responses, so this allows ~60 LLM calls per 5 minutes
 */
export const experimentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // Limit each IP to 15 experiment creations per 5 minutes
  message: {
    success: false,
    error: 'Too many experiment requests. Please wait a few minutes before creating more experiments.',
    retryAfter: '5 minutes',
    timestamp: new Date().toISOString(),
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many experiment requests. Please wait a few minutes before creating more experiments.',
      retryAfter: '5 minutes',
      timestamp: new Date().toISOString(),
    })
  },
})

/**
 * History/read endpoints rate limiter (40 requests per 5 minutes)
 * Less strict limit for read-only operations
 * Allows users to browse their experiment history more freely
 */
export const historyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40, // Limit each IP to 40 history requests per 5 minutes
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment before fetching more data.',
    retryAfter: '5 minutes',
    timestamp: new Date().toISOString(),
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before fetching more data.',
      retryAfter: '5 minutes',
      timestamp: new Date().toISOString(),
    })
  },
})
