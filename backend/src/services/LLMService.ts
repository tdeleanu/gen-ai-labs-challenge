import { generateText } from 'ai'
import { createMistral } from '@ai-sdk/mistral'
import { config } from '../config/environment.js'
import { createLogger } from '../utils/logger.js'
import type { LLMParameters, LLMResponse } from '../types.js'

const logger = createLogger('LLMService')

// Create Mistral provider instance with API key
const mistral = createMistral({
  apiKey: config.ai.mistral.apiKey,
})

export class LLMService {
  constructor() {
    logger.info('LLMService initialized with AI SDK')
  }

  async generateResponse(prompt: string, parameters: LLMParameters, silent = false): Promise<LLMResponse> {
    const startTime = Date.now()

    try {
      if (!silent) {
        logger.info({ prompt: prompt.substring(0, 50), parameters }, 'Generating LLM response')
      }

      const { text, usage } = await generateText({
        model: mistral(config.ai.mistral.model),
        prompt,
        temperature: parameters.temperature,
        topP: parameters.topP,
        maxOutputTokens: parameters.maxTokens,
      })

      const latencyMs = Date.now() - startTime
      const tokensUsed = usage.totalTokens || 0

      if (!silent) {
        logger.info(
          {
            tokensUsed,
            latencyMs,
            textLength: text.length,
          },
          'LLM response generated successfully'
        )
      }

      return {
        text,
        tokensUsed,
        latencyMs,
      }
    } catch (error) {
      const latencyMs = Date.now() - startTime
      logger.error({ error, latencyMs }, 'Failed to generate LLM response')
      throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate multiple responses with different parameter combinations
   */
  async generateBatch(prompt: string, parameterSets: LLMParameters[]): Promise<LLMResponse[]> {
    logger.info({ prompt: prompt.substring(0, 50), count: parameterSets.length }, 'Generating batch of LLM responses')

    const promises = parameterSets.map((params) => this.generateResponse(prompt, params, true))
    const results = await Promise.all(promises)

    const totalTokens = results.reduce((sum, r) => sum + r.tokensUsed, 0)
    const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length

    logger.info(
      { count: results.length, totalTokens, avgLatencyMs: Math.round(avgLatency) },
      'Batch generation complete'
    )
    return results
  }
}

// Singleton instance
export const llmService = new LLMService()
