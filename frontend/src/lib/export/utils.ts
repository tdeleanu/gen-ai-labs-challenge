/**
 * Export Utilities
 * Helper functions for file downloads and formatting
 */

/**
 * Trigger a browser download for the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Generate a safe filename from experiment data
 */
export function generateFilename(experimentId: string, format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const shortId = experimentId.slice(0, 8)
  return `llm-lab-experiment-${shortId}-${timestamp}.${format}`
}

/**
 * Escape CSV field to prevent injection and handle special characters
 */
export function escapeCSVField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) return ''
  const str = String(field)

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

/**
 * Format a number for display
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return 'N/A'
  return value.toFixed(decimals)
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
