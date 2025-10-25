export interface ExperimentResponse {
  id: string;
  text: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  tokensUsed: number;
  latencyMs: number;
  metricsOverall: number;
  metricsLength: number;
  metricsCoherence: number;
  metricsStructure: number;
  metricsReadability: number;
  metricsCompleteness: number;
  metricsSpecificity: number;
  createdAt: string;
}

export interface Experiment {
  id: string;
  prompt: string;
  sessionId: string;
  responses: ExperimentResponse[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExperimentRequest {
  prompt: string;
  parameterCombinations: {
    temperature: number;
    topP: number;
  }[];
}

export interface CreateExperimentResponse {
  success: boolean;
  data: Experiment;
  timestamp: string;
}

export interface ExperimentHistoryResponse {
  success: boolean;
  data: {
    experiments: Experiment[];
    total: number;
  };
  timestamp: string;
}
