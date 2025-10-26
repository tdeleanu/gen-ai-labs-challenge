/**
 * Export Types
 * Type definitions for the export system
 */

import type { Experiment } from '@/types/experiment'

export type ExportFormat = 'json' | 'csv' | 'md'

export interface ExportOptions {
  format: ExportFormat
  experiment: Experiment
  filename?: string
}

export interface ExportResult {
  success: boolean
  filename: string
  error?: string
}

export type ExporterFunction = (experiment: Experiment) => string
