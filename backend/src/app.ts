import express, { Application } from 'express'
import cors from 'cors'
import { config } from './config/environment.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { createLogger } from './utils/logger.js'
import { sanitizeBodyForLogging } from './utils/helpers.js'

const logger = createLogger('App')

export const createApp = (): Application => {
  const app = express()

  // Enable trust proxy when running behind a reverse proxy (Fly.io, etc.)
  // This allows Express to properly parse X-Forwarded-* headers for rate limiting and IP detection
  // Set to 1 to trust only the first proxy, preventing IP spoofing
  if (config.isProduction) {
    app.set('trust proxy', 1)
  }

  app.use(cors(config.cors))

  // Apply global rate limiter to all routes
  app.use(generalLimiter)

  // Apply JSON parser
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (config.isDevelopment) {
    app.use((req, _res, next) => {
      logger.debug(
        {
          query: req.query,
          body: sanitizeBodyForLogging(req.body),
        },
        `${req.method} ${req.path}`,
      )
      next()
    })
  }

  app.use(routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
