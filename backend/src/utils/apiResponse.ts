import { Response } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

export class ApiResponseHandler {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    }
    return res.status(statusCode).json(response)
  }

  static error(res: Response, error: string | Error, statusCode = 500) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
    }
    return res.status(statusCode).json(response)
  }

  static badRequest(res: Response, message: string) {
    return this.error(res, message, 400)
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return this.error(res, message, 401)
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return this.error(res, message, 403)
  }

  static notFound(res: Response, message = 'Resource not found') {
    return this.error(res, message, 404)
  }

  static serverError(res: Response, error: Error | string) {
    return this.error(res, error, 500)
  }
}
