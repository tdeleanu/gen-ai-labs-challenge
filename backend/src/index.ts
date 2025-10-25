import { validateConfig } from './config/environment.js'
import { Server } from './server.service.js'
import { createLogger } from './utils/logger.js'

const logger = createLogger('Main')

let server: Server

async function main(): Promise<void> {
  try {
    validateConfig()

    logger.info('Starting LLM Lab API Server')
    server = new Server()
    await server.init()
    server.start()
  } catch (error) {
    logger.error(
      {
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
      'Failed to start server',
    )
    process.exit(1)
  }
}

async function shutdownHandler(): Promise<void> {
  if (server?.isShutdownInProgress()) {
    logger.info('🚫 Shutdown is already in progress...')
    return
  }

  if (server) {
    await server.triggerShutdown()
  }

  logger.info('Shut-down sequence complete. Bye bye 👋')
  process.exit(0)
}

process.on('SIGINT', async () => {
  logger.warn('Received SIGINT signal. Shutting down...')
  await shutdownHandler()
})

process.on('SIGTERM', async () => {
  logger.warn('Received SIGTERM signal. Shutting down...')
  await shutdownHandler()
})

void main()
