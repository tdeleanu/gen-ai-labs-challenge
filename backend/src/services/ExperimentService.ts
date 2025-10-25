import { PrismaClient } from '@prisma/client'
import { createLogger } from '../utils/logger.js'
import { llmService } from './LLMService.js'
import { metricsService } from './MetricsService.js'
import type {
  LLMParameters,
  ParameterRanges,
  ExperimentRequest,
  ExperimentData,
} from '../types.js'

const logger = createLogger('ExperimentService')
const prisma = new PrismaClient()

export class ExperimentService {
  /**
   * Generate a random number between min and max
   */
  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }

  /**
   * Generate 4 random parameter combinations from the provided ranges
   * Applies provider-specific limits (e.g., Mistral temperature max 1.5)
   */
  private generateParameterCombinations(ranges: ParameterRanges): LLMParameters[] {
    const combinations: LLMParameters[] = []

    // Mistral API temperature limit
    const MAX_TEMPERATURE = 1.5

    for (let i = 0; i < 4; i++) {
      // Clamp temperature to provider limits
      const clampedTempMax = Math.min(ranges.temperatureMax, MAX_TEMPERATURE)
      const clampedTempMin = Math.min(ranges.temperatureMin, MAX_TEMPERATURE)

      combinations.push({
        temperature: this.randomBetween(clampedTempMin, clampedTempMax),
        topP: this.randomBetween(ranges.topPMin, ranges.topPMax),
        maxTokens: ranges.maxTokens, // Single value, not a range
      })
    }

    logger.info({ combinations }, 'Generated 4 parameter combinations')
    return combinations
  }

  /**
   * Create a new experiment with 4 LLM responses
   */
  async createExperiment(request: ExperimentRequest): Promise<ExperimentData> {
    const { sessionId, prompt, parameters } = request

    logger.info({ sessionId, promptLength: prompt.length }, 'Creating new experiment')

    try {
      // Generate 4 random parameter combinations
      const parameterSets = this.generateParameterCombinations(parameters)

      // Generate 4 LLM responses in parallel
      const llmResponses = await llmService.generateBatch(prompt, parameterSets)

      // Create experiment in database
      const experiment = await prisma.experiment.create({
        data: {
          sessionId,
          prompt,
          responses: {
            create: llmResponses.map((llmResponse, index) => {
              const params = parameterSets[index]
              const metrics = metricsService.calculateMetrics(llmResponse.text, llmResponse.tokensUsed)

              return {
                text: llmResponse.text,
                temperature: params.temperature,
                topP: params.topP,
                maxTokens: params.maxTokens,
                tokensUsed: llmResponse.tokensUsed,
                latencyMs: llmResponse.latencyMs,
                metricsOverall: metrics.overall,
                metricsLength: metrics.length,
                metricsCoherence: metrics.coherence,
                metricsStructure: metrics.structure,
                metricsReadability: metrics.readability,
                metricsCompleteness: metrics.completeness,
                metricsSpecificity: metrics.specificity,
              }
            }),
          },
        },
        include: {
          responses: true,
        },
      })

      logger.info({ experimentId: experiment.id, responseCount: experiment.responses.length }, 'Experiment created successfully')

      return experiment as ExperimentData
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to create experiment')
      throw new Error(`Failed to create experiment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get experiment by ID
   */
  async getExperiment(id: string, sessionId: string): Promise<ExperimentData | null> {
    logger.info({ id, sessionId }, 'Fetching experiment')

    try {
      const experiment = await prisma.experiment.findFirst({
        where: {
          id,
          sessionId, // Ensure user can only access their own experiments
        },
        include: {
          responses: true,
        },
      })

      if (!experiment) {
        logger.warn({ id, sessionId }, 'Experiment not found')
        return null
      }

      return experiment as ExperimentData
    } catch (error) {
      logger.error({ error, id, sessionId }, 'Failed to fetch experiment')
      throw new Error(`Failed to fetch experiment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all experiments for a session
   */
  async getExperimentHistory(sessionId: string, limit = 20): Promise<ExperimentData[]> {
    logger.info({ sessionId, limit }, 'Fetching experiment history')

    try {
      const experiments = await prisma.experiment.findMany({
        where: {
          sessionId,
        },
        include: {
          responses: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      })

      logger.info({ sessionId, count: experiments.length }, 'Experiment history fetched')
      return experiments as ExperimentData[]
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to fetch experiment history')
      throw new Error(`Failed to fetch experiment history: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Singleton instance
export const experimentService = new ExperimentService()
