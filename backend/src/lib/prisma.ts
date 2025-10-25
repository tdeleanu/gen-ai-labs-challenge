import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('PrismaClient')

/**
 * Prisma Client Singleton
 *
 * This ensures only ONE PrismaClient instance is created across the entire application,
 * preventing connection pool exhaustion and following Prisma best practices.
 *
 * In development, we use globalThis to preserve the instance across hot reloads.
 * In production, we create a single instance that persists for the app lifetime.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications
 */

// Extend globalThis type to include prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // Production: Create a single instance with connection pool logging
  prisma = new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'query', emit: 'event' },
    ],
  })

  // Log connection pool errors and warnings
  prisma.$on('warn' as never, (e: Prisma.LogEvent) => {
    logger.warn({ target: e.target, message: e.message }, 'Prisma warning')
  })

  prisma.$on('error' as never, (e: Prisma.LogEvent) => {
    logger.error({ target: e.target, message: e.message }, 'Prisma error')
  })

  // Log slow queries (over 1 second)
  prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    if (e.duration > 1000) {
      logger.warn({ query: e.query, duration: e.duration }, 'Slow query detected')
    }
  })

  logger.info('PrismaClient singleton initialized (production mode)')
} else {
  // Development: Reuse existing instance to prevent hot-reload issues
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['warn', 'error'],
    })

    logger.info('PrismaClient singleton initialized (development mode)')
  }

  prisma = global.prisma
}

// Graceful shutdown handler
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect()
    logger.info('PrismaClient disconnected successfully')
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Error disconnecting PrismaClient')
  }
}

export { prisma }
