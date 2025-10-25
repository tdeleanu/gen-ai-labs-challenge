import { createLogger } from '../utils/logger.js'
import type { QualityMetrics } from '../types.js'

const logger = createLogger('MetricsService')

/**
 * MetricsService - Comprehensive programmatic quality evaluation for LLM responses
 *
 * This service implements multiple scoring algorithms to evaluate different aspects
 * of LLM response quality without relying on additional LLM calls. Each metric
 * provides actionable insights into response characteristics.
 */
export class MetricsService {
  /**
   * Calculate comprehensive quality metrics for an LLM response
   */
  calculateMetrics(text: string, tokensUsed: number): QualityMetrics {
    logger.info({ textLength: text.length, tokensUsed }, 'Calculating comprehensive quality metrics')

    const length = this.calculateLengthScore(text, tokensUsed)
    const coherence = this.calculateCoherenceScore(text)
    const structure = this.calculateStructureScore(text)
    const readability = this.calculateReadabilityScore(text)
    const completeness = this.calculateCompletenessScore(text)
    const specificity = this.calculateSpecificityScore(text)

    // Weighted average for overall score
    // Emphasize coherence and structure as they're most important for quality
    const overall = (
      coherence * 0.25 +
      structure * 0.20 +
      completeness * 0.20 +
      readability * 0.15 +
      length * 0.10 +
      specificity * 0.10
    )

    const metrics: QualityMetrics = {
      overall: this.round(overall),
      length: this.round(length),
      coherence: this.round(coherence),
      structure: this.round(structure),
      readability: this.round(readability),
      completeness: this.round(completeness),
      specificity: this.round(specificity),
    }

    logger.info({ metrics }, 'Metrics calculated')
    return metrics
  }

  /**
   * LENGTH SCORE - Evaluates response length appropriateness
   *
   * Rationale: Good responses have appropriate length - not too short (incomplete)
   * or too long (verbose). Considers both word count and token efficiency.
   *
   * Factors:
   * - Word count relative to typical response range (100-500 words is ideal)
   * - Sentence count (indicates proper segmentation)
   * - Token efficiency (words per token ratio)
   */
  private calculateLengthScore(text: string, tokensUsed: number): number {
    const words = text.trim().split(/\s+/)
    const wordCount = words.length
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const sentenceCount = sentences.length

    // Word count score (0-1): optimal range 100-500 words
    let wordScore = 0
    if (wordCount < 50) {
      wordScore = wordCount / 50 * 0.5 // Too short: 0-0.5
    } else if (wordCount <= 300) {
      wordScore = 0.5 + (wordCount - 50) / 250 * 0.5 // Ideal range: 0.5-1.0
    } else if (wordCount <= 500) {
      wordScore = 1.0 - (wordCount - 300) / 200 * 0.2 // Good but getting long: 0.8-1.0
    } else {
      wordScore = Math.max(0.6, 0.8 - (wordCount - 500) / 500 * 0.2) // Too long: 0.6-0.8
    }

    // Sentence count score: should have reasonable segmentation
    let sentenceScore = 0
    if (sentenceCount === 0) {
      sentenceScore = 0.3
    } else if (sentenceCount < 3) {
      sentenceScore = 0.6
    } else if (sentenceCount <= 20) {
      sentenceScore = 1.0
    } else {
      sentenceScore = Math.max(0.7, 1.0 - (sentenceCount - 20) / 30 * 0.3)
    }

    // Token efficiency: good responses typically have 0.7-0.8 words per token
    const wordsPerToken = tokensUsed > 0 ? wordCount / tokensUsed : 0
    let efficiencyScore = 0.8
    if (wordsPerToken >= 0.7 && wordsPerToken <= 0.85) {
      efficiencyScore = 1.0
    } else if (wordsPerToken < 0.7) {
      efficiencyScore = Math.max(0.5, wordsPerToken / 0.7)
    } else {
      efficiencyScore = Math.max(0.6, 1.0 - (wordsPerToken - 0.85) / 0.3)
    }

    return wordScore * 0.5 + sentenceScore * 0.3 + efficiencyScore * 0.2
  }

  /**
   * COHERENCE SCORE - Evaluates logical flow and vocabulary quality
   *
   * Rationale: Coherent responses use rich vocabulary, vary sentence structure,
   * avoid excessive repetition, and flow naturally from one idea to the next.
   *
   * Factors:
   * - Lexical diversity (unique words / total words)
   * - Sentence length variety (standard deviation)
   * - Repetition detection (repeated phrases)
   * - Transition word usage
   */
  private calculateCoherenceScore(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    if (words.length === 0) return 0

    // Lexical diversity: ratio of unique words to total words
    const uniqueWords = new Set(words.filter((w) => w.length > 2)) // Filter out very short words
    const lexicalDiversity = uniqueWords.size / Math.max(words.length, 1)

    // Score lexical diversity (0.3-0.7 is typical for good responses)
    let diversityScore = 0
    if (lexicalDiversity < 0.3) {
      diversityScore = lexicalDiversity / 0.3 * 0.6 // Too repetitive
    } else if (lexicalDiversity <= 0.6) {
      diversityScore = 0.6 + (lexicalDiversity - 0.3) / 0.3 * 0.4 // Good range
    } else {
      diversityScore = 1.0 // Excellent diversity
    }

    // Sentence length variety: calculate standard deviation
    let varietyScore = 0
    if (sentences.length > 1) {
      const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).length)
      const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
      const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length
      const stdDev = Math.sqrt(variance)

      // Good variety: stddev between 3-8 words
      if (stdDev < 2) {
        varietyScore = stdDev / 2 * 0.6 // Too monotonous
      } else if (stdDev <= 8) {
        varietyScore = 0.6 + (stdDev - 2) / 6 * 0.4 // Good variety
      } else {
        varietyScore = Math.max(0.7, 1.0 - (stdDev - 8) / 10 * 0.3) // Too varied
      }
    } else {
      varietyScore = 0.5
    }

    // Repetition detection: check for repeated 3-word phrases
    let repetitionScore = 1.0
    const trigrams = new Map<string, number>()
    for (let i = 0; i < words.length - 2; i++) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
      trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1)
    }

    let maxRepetitions = 0
    for (const count of trigrams.values()) {
      if (count > maxRepetitions) maxRepetitions = count
    }

    if (maxRepetitions > 3) {
      repetitionScore = Math.max(0.5, 1.0 - (maxRepetitions - 3) / 5 * 0.5)
    }

    // Transition words: indicators of logical flow
    const transitionWords = [
      'however', 'therefore', 'furthermore', 'moreover', 'additionally',
      'consequently', 'nevertheless', 'thus', 'hence', 'meanwhile',
      'similarly', 'likewise', 'conversely', 'alternatively', 'specifically',
      'for example', 'for instance', 'in contrast', 'on the other hand',
      'as a result', 'in addition', 'in conclusion', 'to summarize'
    ]

    const transitionCount = transitionWords.reduce((count, word) => {
      return count + (text.toLowerCase().includes(word) ? 1 : 0)
    }, 0)

    const transitionScore = Math.min(1.0, transitionCount / 3 * 0.5 + 0.5)

    return diversityScore * 0.35 + varietyScore * 0.25 + repetitionScore * 0.25 + transitionScore * 0.15
  }

  /**
   * STRUCTURE SCORE - Evaluates organization and formatting
   *
   * Rationale: Well-structured responses have clear organization with paragraphs,
   * proper formatting, logical sections, and appropriate use of lists/bullets.
   *
   * Factors:
   * - Paragraph count and distribution
   * - Introduction and conclusion presence
   * - List usage (bullets, numbered)
   * - Heading/section markers
   */
  private calculateStructureScore(text: string): number {
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0)

    // Paragraph score: good responses have multiple well-distributed paragraphs
    let paragraphScore = 0
    if (paragraphs.length === 0) {
      paragraphScore = 0.3
    } else if (paragraphs.length === 1) {
      paragraphScore = 0.5
    } else if (paragraphs.length <= 5) {
      paragraphScore = 0.5 + paragraphs.length / 5 * 0.5
    } else {
      paragraphScore = Math.max(0.8, 1.0 - (paragraphs.length - 5) / 10 * 0.2)
    }

    // Check for introduction (first paragraph should be substantial)
    let hasIntro = false
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0]
      const firstParagraphSentences = firstParagraph.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      hasIntro = firstParagraphSentences.length >= 2 && firstParagraph.length > 50
    }

    // Check for conclusion (last paragraph often contains summary words)
    let hasConclusion = false
    if (paragraphs.length > 1) {
      const lastParagraph = paragraphs[paragraphs.length - 1].toLowerCase()
      const conclusionWords = ['conclusion', 'summary', 'in summary', 'to summarize', 'overall', 'in short', 'finally']
      hasConclusion = conclusionWords.some((word) => lastParagraph.includes(word))
    }

    const introOutroScore = (hasIntro ? 0.5 : 0) + (hasConclusion ? 0.5 : 0)

    // List usage: check for bullets, numbers, or markdown lists
    const hasBulletList = /^[\s]*[-*•]\s+/m.test(text) || /^[\s]*\d+\.\s+/m.test(text)
    const listScore = hasBulletList ? 1.0 : 0.6

    // Heading usage: check for markdown headings or emphasized section markers
    const hasHeadings = /^#+\s+/m.test(text) || /^[A-Z][^.!?]*:$/m.test(text)
    const headingScore = hasHeadings ? 1.0 : 0.7

    // Logical flow: paragraphs should be reasonably balanced
    let balanceScore = 0.8
    if (paragraphs.length > 1) {
      const paragraphLengths = paragraphs.map((p) => p.length)
      const avgLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length
      const maxDeviation = Math.max(...paragraphLengths.map((len) => Math.abs(len - avgLength)))
      const deviationRatio = maxDeviation / avgLength

      if (deviationRatio < 0.5) {
        balanceScore = 1.0
      } else if (deviationRatio < 1.5) {
        balanceScore = 1.0 - (deviationRatio - 0.5) / 1.0 * 0.3
      } else {
        balanceScore = 0.6
      }
    }

    return paragraphScore * 0.3 + introOutroScore * 0.25 + listScore * 0.15 + headingScore * 0.15 + balanceScore * 0.15
  }

  /**
   * READABILITY SCORE - Evaluates ease of reading
   *
   * Rationale: Readable responses use appropriate vocabulary, maintain good
   * sentence complexity, and follow readability best practices.
   *
   * Factors:
   * - Flesch Reading Ease score
   * - Average syllables per word
   * - Sentence complexity
   * - Technical term density
   */
  private calculateReadabilityScore(text: string): number {
    const words = text.split(/\s+/).filter((w) => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    if (words.length === 0 || sentences.length === 0) return 0.5

    // Calculate syllables (rough approximation)
    const countSyllables = (word: string): number => {
      word = word.toLowerCase().replace(/[^a-z]/g, '')
      if (word.length <= 3) return 1

      // Count vowel groups
      const vowels = word.match(/[aeiouy]+/g)
      let syllables = vowels ? vowels.length : 1

      // Adjust for silent 'e'
      if (word.endsWith('e')) syllables--
      if (word.endsWith('le') && word.length > 2) syllables++

      return Math.max(1, syllables)
    }

    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0)
    const avgSyllablesPerWord = totalSyllables / words.length
    const avgWordsPerSentence = words.length / sentences.length

    // Flesch Reading Ease: 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord

    // Convert Flesch (0-100, higher is easier) to our 0-1 scale
    // 60-70 is ideal (standard reading level)
    let fleschNormalized = 0
    if (fleschScore < 30) {
      fleschNormalized = Math.max(0.3, fleschScore / 30 * 0.5) // Very difficult
    } else if (fleschScore <= 70) {
      fleschNormalized = 0.5 + (fleschScore - 30) / 40 * 0.5 // Good range
    } else if (fleschScore <= 90) {
      fleschNormalized = 1.0 - (fleschScore - 70) / 20 * 0.1 // Very easy (maybe too simple)
    } else {
      fleschNormalized = 0.9 // Too simple
    }

    // Syllable complexity score
    let syllableScore = 1.0
    if (avgSyllablesPerWord < 1.3) {
      syllableScore = 0.7 // Too simple
    } else if (avgSyllablesPerWord <= 1.7) {
      syllableScore = 1.0 // Ideal
    } else if (avgSyllablesPerWord <= 2.5) {
      syllableScore = 1.0 - (avgSyllablesPerWord - 1.7) / 0.8 * 0.3 // Getting complex
    } else {
      syllableScore = 0.5 // Too complex
    }

    // Sentence complexity score
    let sentenceComplexityScore = 1.0
    if (avgWordsPerSentence < 10) {
      sentenceComplexityScore = 0.7 // Too simple
    } else if (avgWordsPerSentence <= 20) {
      sentenceComplexityScore = 1.0 // Ideal
    } else if (avgWordsPerSentence <= 30) {
      sentenceComplexityScore = 1.0 - (avgWordsPerSentence - 20) / 10 * 0.3
    } else {
      sentenceComplexityScore = 0.6 // Too complex
    }

    // Technical term density: words > 12 characters
    const longWords = words.filter((w) => w.length > 12)
    const technicalDensity = longWords.length / words.length
    let technicalScore = 1.0
    if (technicalDensity > 0.15) {
      technicalScore = Math.max(0.6, 1.0 - (technicalDensity - 0.15) / 0.1 * 0.4)
    }

    return fleschNormalized * 0.4 + syllableScore * 0.25 + sentenceComplexityScore * 0.2 + technicalScore * 0.15
  }

  /**
   * COMPLETENESS SCORE - Evaluates response completeness
   *
   * Rationale: Complete responses end properly, don't cut off mid-sentence,
   * and have appropriate density of information throughout.
   *
   * Factors:
   * - Proper ending (ends with punctuation)
   * - No mid-sentence cutoffs
   * - Consistent information density
   * - Minimum threshold met
   */
  private calculateCompletenessScore(text: string): number {
    const words = text.trim().split(/\s+/)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    // Check if response ends properly
    const endsWithPunctuation = /[.!?]$/.test(text.trim())
    const endsWithEllipsis = /\.\.\.$/.test(text.trim())

    let endingScore = 0
    if (endsWithPunctuation && !endsWithEllipsis) {
      endingScore = 1.0
    } else if (endsWithEllipsis) {
      endingScore = 0.6 // Indicates incomplete thought
    } else {
      endingScore = 0.4 // Likely cut off
    }

    // Check for mid-sentence cutoff indicators
    const lastSentence = sentences.length > 0 ? sentences[sentences.length - 1].trim() : ''
    const cutoffIndicators = ['...', 'and so', 'and then', 'and the', 'which', 'that', 'when', 'where']
    const hasCutoffIndicator = cutoffIndicators.some((indicator) => lastSentence.toLowerCase().endsWith(indicator))

    if (hasCutoffIndicator) {
      endingScore *= 0.7
    }

    // Minimum length threshold
    let thresholdScore = 1.0
    if (words.length < 30) {
      thresholdScore = words.length / 30 * 0.6 // Too short to be complete
    } else if (words.length < 50) {
      thresholdScore = 0.6 + (words.length - 30) / 20 * 0.4
    }

    // Information density: check if all sentences contribute meaningfully
    let densityScore = 0.9
    if (sentences.length > 0) {
      const shortSentences = sentences.filter((s) => s.trim().split(/\s+/).length < 4)
      const shortRatio = shortSentences.length / sentences.length

      if (shortRatio > 0.3) {
        densityScore = Math.max(0.6, 0.9 - (shortRatio - 0.3) / 0.3 * 0.3)
      }
    }

    // Content progression: check if response builds properly
    let progressionScore = 0.8
    if (sentences.length >= 3) {
      const firstThirdLength = sentences.slice(0, Math.floor(sentences.length / 3)).join(' ').length
      const lastThirdLength = sentences.slice(-Math.floor(sentences.length / 3)).join(' ').length

      // Later sections should have similar or more content
      if (lastThirdLength >= firstThirdLength * 0.5) {
        progressionScore = 1.0
      } else {
        progressionScore = 0.6 // Tapers off unnaturally
      }
    }

    return endingScore * 0.35 + thresholdScore * 0.25 + densityScore * 0.25 + progressionScore * 0.15
  }

  /**
   * SPECIFICITY SCORE - Evaluates level of detail and concreteness
   *
   * Rationale: Specific responses include examples, numbers, names, and concrete
   * details rather than vague generalities. This indicates depth of content.
   *
   * Factors:
   * - Numbers and quantitative data
   * - Named entities (proper nouns)
   * - Example usage ("for example", "such as")
   * - Concrete vs abstract language ratio
   */
  private calculateSpecificityScore(text: string): number {
    const words = text.split(/\s+/).filter((w) => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    if (words.length === 0) return 0

    // Count numbers and quantitative data
    const numberPattern = /\b\d+(?:\.\d+)?(?:%|k|m|b)?\b/gi
    const numbers = text.match(numberPattern) || []
    const numberDensity = numbers.length / sentences.length
    const numberScore = Math.min(1.0, numberDensity / 2 * 0.5 + 0.5)

    // Count proper nouns (capitalized words that aren't sentence starts)
    const properNouns = words.filter((word, index) => {
      if (index === 0) return false // Skip first word
      const prevChar = text.charAt(text.indexOf(word) - 2)
      if (/[.!?]/.test(prevChar)) return false // Skip words after punctuation
      return /^[A-Z][a-z]+/.test(word)
    })
    const properNounDensity = properNouns.length / words.length
    const properNounScore = Math.min(1.0, properNounDensity / 0.05 * 0.5 + 0.5)

    // Check for example indicators
    const exampleIndicators = [
      'for example', 'for instance', 'such as', 'like', 'including',
      'e.g.', 'i.e.', 'specifically', 'particularly', 'namely'
    ]
    const exampleCount = exampleIndicators.reduce((count, indicator) => {
      return count + (text.toLowerCase().includes(indicator) ? 1 : 0)
    }, 0)
    const exampleScore = Math.min(1.0, exampleCount / 2 * 0.5 + 0.5)

    // Concrete vs abstract language
    // Concrete words: specific nouns, action verbs, sensory words
    const concreteIndicators = words.filter((word) => {
      const w = word.toLowerCase()
      // Look for specific patterns
      return w.length > 4 && (
        /^(make|build|create|write|design|develop|implement|test)/.test(w) ||
        /ing$/.test(w) || // Present participles
        /ed$/.test(w) ||  // Past tense
        /tion$/.test(w)   // Specific nouns
      )
    })

    const concreteness = concreteIndicators.length / words.length
    const concreteScore = Math.min(1.0, concreteness / 0.15 * 0.5 + 0.5)

    return numberScore * 0.25 + properNounScore * 0.25 + exampleScore * 0.3 + concreteScore * 0.20
  }

  /**
   * Helper: Round to 2 decimal places
   */
  private round(value: number): number {
    return Math.round(value * 100) / 100
  }
}

// Singleton instance
export const metricsService = new MetricsService()
