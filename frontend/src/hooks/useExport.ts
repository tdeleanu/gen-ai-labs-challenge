/**
 * useExport Hook
 * Custom hook for exporting experiment data in various formats
 */

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { Experiment } from '@/types/experiment'
import {
  exportToJSON,
  exportToCSV,
  exportToMarkdown,
  downloadFile,
  generateFilename,
  type ExportFormat,
} from '@/lib/export'

interface UseExportReturn {
  exportExperiment: (experiment: Experiment, format: ExportFormat) => void
  isExporting: boolean
}

const MIME_TYPES: Record<ExportFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  md: 'text/markdown',
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
  md: 'Markdown',
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false)

  const exportExperiment = useCallback((experiment: Experiment, format: ExportFormat) => {
    setIsExporting(true)

    try {
      // Generate content based on format
      let content: string
      switch (format) {
        case 'json':
          content = exportToJSON(experiment)
          break
        case 'csv':
          content = exportToCSV(experiment)
          break
        case 'md':
          content = exportToMarkdown(experiment)
          break
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      // Generate filename and trigger download
      const filename = generateFilename(experiment.id, format)
      const mimeType = MIME_TYPES[format]

      downloadFile(content, filename, mimeType)

      // Success feedback
      toast.success(`Exported as ${FORMAT_LABELS[format]}`, {
        description: filename,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      setIsExporting(false)
    }
  }, [])

  return {
    exportExperiment,
    isExporting,
  }
}
