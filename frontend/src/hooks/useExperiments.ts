import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from '@/contexts/SessionContext'

export interface ExperimentResponse {
  id: string
  sessionId: string
  prompt: string
  responses: Array<{
    id: string
    text: string
    temperature: number
    topP: number
    maxTokens: number
    tokensUsed: number
    latencyMs: number
    metricsOverall: number
    metricsLength: number
    metricsCoherence: number
    metricsStructure: number
    metricsReadability: number
    metricsCompleteness: number
    metricsSpecificity: number
    createdAt: string
  }>
  createdAt: string
}

export interface CreateExperimentRequest {
  prompt: string
  parameters: {
    temperatureMin: number
    temperatureMax: number
    topPMin: number
    topPMax: number
    maxTokens: number
  }
}

export function useCreateExperiment() {
  const { sessionId } = useSession()

  return useMutation<ExperimentResponse, Error, CreateExperimentRequest>({
    mutationFn: async (data) => {
      // Get session ID from context
      if (!sessionId) {
        throw new Error('No session ID found. Please refresh the page.')
      }

      // Call Next.js API route which proxies to backend
      const response = await fetch('/api/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create experiment')
      }

      const result = await response.json()
      return result.data
    },
  })
}

export function useExperimentHistory() {
  const { sessionId } = useSession()

  return useQuery<ExperimentResponse[], Error>({
    queryKey: ['experimentHistory', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        return []
      }

      const response = await fetch(`/api/experiments/history?limit=50`, {
        headers: {
          'X-Session-ID': sessionId,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch experiment history')
      }

      const result = await response.json()
      return result.data
    },
    enabled: !!sessionId,
  })
}

export function useExperimentById(id: string) {
  const { sessionId } = useSession()

  return useQuery<ExperimentResponse, Error>({
    queryKey: ['experiment', id, sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('No session ID found')
      }

      const response = await fetch(`/api/experiments/${id}`, {
        headers: {
          'X-Session-ID': sessionId,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch experiment')
      }

      const result = await response.json()
      return result.data
    },
    enabled: !!sessionId && !!id,
  })
}
