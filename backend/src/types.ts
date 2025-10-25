// LLM Service Types
export interface LLMParameters {
  temperature: number
  topP: number
  maxTokens: number
}

export interface LLMResponse {
  text: string
  tokensUsed: number
  latencyMs: number
}

// Metrics Service Types
export interface QualityMetrics {
  overall: number
  length: number
  coherence: number
  structure: number
  readability: number
  completeness: number
  specificity: number
}

// Experiment Service Types
export interface ParameterRanges {
  temperatureMin: number
  temperatureMax: number
  topPMin: number
  topPMax: number
  maxTokens: number
}

export interface ExperimentRequest {
  sessionId: string
  prompt: string
  parameters: ParameterRanges
}

export interface ResponseData {
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
  createdAt: Date
}

export interface ExperimentData {
  id: string
  sessionId: string
  prompt: string
  responses: ResponseData[]
  createdAt: Date
}
