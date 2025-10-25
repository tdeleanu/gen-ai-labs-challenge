import pino from 'pino'
import { config } from '../config/environment.js'

// Configure pino with pretty printing for development
const pinoConfig = config.isDevelopment
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '{if context}[{context}] {end}{msg}',
        },
      },
      level: 'debug',
    }
  : {
      level: 'info',
      formatters: {
        level: (label: string) => {
          return { level: label.toUpperCase() }
        },
      },
    }

// Create base logger
const baseLogger = pino(pinoConfig)

// Export a function to create context-aware loggers
export const createLogger = (context: string) => {
  return baseLogger.child({ context })
}

// Export the base logger for cases where context isn't needed
export default baseLogger
