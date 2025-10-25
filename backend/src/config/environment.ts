import dotenv from 'dotenv'
import envVar from 'env-var'

// Load environment variables from .env file
dotenv.config()

const get = envVar.get

// Export the config object
export const config = {
  port: get('PORT').default('5001').asPortNumber(),
  nodeEnv: get('NODE_ENV').default('development').asEnum(['production', 'development', 'test']) as
    | 'production'
    | 'development'
    | 'test',

  database: {
    url: get('DATABASE_URL').default('file:./llmlab.db').asString(),
  },

  ai: {
    mistral: {
      apiKey: get('MISTRAL_API_KEY').required().asString(),
      model: get('MISTRAL_MODEL').default('mistral-small-latest').asString(),
    },
  },

  cors: {
    origin: (get('CORS_ORIGIN').asString() || '')
      .split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0),
  },

  get isDevelopment() {
    return this.nodeEnv === 'development'
  },

  get isProduction() {
    return this.nodeEnv === 'production'
  },
}

export const validateConfig = () => {
  const errors: string[] = []

  // Validate Mistral API key
  if (!config.ai.mistral.apiKey) {
    errors.push('Missing MISTRAL_API_KEY environment variable')
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
}
