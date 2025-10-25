export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validate and sanitize a number within a range
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
  defaultValue?: number
): number {
  // Handle undefined/null
  if (value === undefined || value === null) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new ValidationError(`${fieldName} is required`)
  }

  // Convert to number
  const num = typeof value === 'string' ? parseFloat(value) : Number(value)

  // Check if valid number
  if (isNaN(num) || !isFinite(num)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }

  // Check range
  if (num < min || num > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`)
  }

  return num
}

/**
 * Validate and sanitize a string
 */
export function validateString(
  value: unknown,
  fieldName: string,
  minLength = 0,
  maxLength = Infinity
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`)
  }

  const trimmed = value.trim()

  if (trimmed.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`)
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters`)
  }

  return trimmed
}

/**
 * Validate UUID format
 */
export function validateUUID(value: unknown, fieldName: string): string {
  const str = validateString(value, fieldName)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(str)) {
    throw new ValidationError(`${fieldName} must be a valid UUID`)
  }

  return str
}

/**
 * Validate parameter ranges for experiment creation
 */
export function validateParameterRanges(body: any): {
  temperatureMin: number
  temperatureMax: number
  topPMin: number
  topPMax: number
  maxTokens: number
} {
  const temperatureMin = validateNumber(body.temperatureMin, 'temperatureMin', 0, 2)
  const temperatureMax = validateNumber(body.temperatureMax, 'temperatureMax', 0, 2)
  const topPMin = validateNumber(body.topPMin, 'topPMin', 0, 1)
  const topPMax = validateNumber(body.topPMax, 'topPMax', 0, 1)
  const maxTokens = validateNumber(body.maxTokens, 'maxTokens', 100, 1000)

  // Validate min <= max for ranges
  if (temperatureMin > temperatureMax) {
    throw new ValidationError('temperatureMin must be less than or equal to temperatureMax')
  }
  if (topPMin > topPMax) {
    throw new ValidationError('topPMin must be less than or equal to topPMax')
  }

  return {
    temperatureMin,
    temperatureMax,
    topPMin,
    topPMax,
    maxTokens,
  }
}
