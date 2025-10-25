import http from 'http'
import { config } from './config/environment.js'
import { createApp } from './app.js'
import { createLogger } from './utils/logger.js'
import { disconnectPrisma } from './lib/prisma.js'

const logger = createLogger('Server')

export class Server {
  private server!: http.Server
  private shutdownInProgress = false

  constructor() {
    logger.info('Server instance created')
  }

  public async init(): Promise<void> {
    logger.info('Initializing server...')

    try {
      const app = createApp()
      this.server = http.createServer(app)

      logger.info('Server initialization complete')
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Failed to initialize server')
      throw error
    }
  }

  public start(): void {
    const host = config.isProduction ? '0.0.0.0' : 'localhost'

    this.server.listen(config.port as number, host, () => {
      logger.info(`🚀 LLM Lab API server running on http://${host}:${config.port}`)
      logger.info(`🤖 Session routes: /api/session/*`)
      logger.info(`❤️  Health check: /health`)

      logger.info(
        {
          mistral: config.ai.mistral.apiKey ? '✓ Configured' : '✗ Missing',
        },
        '🔑 API Keys',
      )

      logger.info(
        {
          model: config.ai.mistral.model,
          environment: config.nodeEnv,
          corsOrigin: config.cors.origin,
        },
        '📦 Configuration',
      )
    })

    this.setupGracefulShutdown()
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async () => {
      if (this.shutdownInProgress) {
        logger.info('🚫 Shutdown is already in progress...')
        return
      }

      await this.triggerShutdown()
      logger.info('Shut-down sequence complete. Bye bye 👋')
      process.exit(0)
    }

    process.on('SIGTERM', () => {
      logger.warn('Received SIGTERM signal. Shutting down...')
      gracefulShutdown()
    })

    process.on('SIGINT', () => {
      logger.warn('Received SIGINT signal. Shutting down...')
      gracefulShutdown()
    })
  }

  public async triggerShutdown(): Promise<void> {
    logger.info('Shutting down gracefully...')
    this.shutdownInProgress = true

    // Close server
    await new Promise<void>((resolve) => {
      this.server.close(() => {
        logger.info('Server closed')
        resolve()
      })
    })

    // Disconnect Prisma
    await disconnectPrisma()
  }

  public isShutdownInProgress(): boolean {
    return this.shutdownInProgress
  }
}
