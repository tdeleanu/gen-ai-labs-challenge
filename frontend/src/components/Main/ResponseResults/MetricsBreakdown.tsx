import { useState } from "react";

interface MetricsBreakdownProps {
  metricsLength: number;
  metricsCoherence: number;
  metricsStructure: number;
  metricsReadability: number;
  metricsCompleteness: number;
  metricsSpecificity: number;
}

interface MetricInfo {
  name: string;
  score: number;
  icon: string;
  description: string;
  interpretation: (score: number) => string;
  color: string;
}

export default function MetricsBreakdown({
  metricsLength,
  metricsCoherence,
  metricsStructure,
  metricsReadability,
  metricsCompleteness,
  metricsSpecificity,
}: MetricsBreakdownProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Helper to get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return "text-green-900 bg-green-100 border-green-300";
    if (score >= 0.5) return "text-orange-900 bg-orange-100 border-orange-300";
    return "text-red-900 bg-red-100 border-red-300";
  };

  const getBarColor = (score: number): string => {
    if (score >= 0.8) return "bg-green-600";
    if (score >= 0.5) return "bg-orange-500";
    return "bg-red-600";
  };

  const metrics: MetricInfo[] = [
    {
      name: "Length",
      score: metricsLength,
      icon: "📏",
      description: "Evaluates if the response has appropriate length and density",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Excellent length! The response is well-proportioned with optimal word count (100-500 words), good sentence distribution, and efficient token usage. Not too brief, not too verbose.";
        } else if (score >= 0.5) {
          return "Acceptable length. The response could be better balanced - either slightly too brief or too verbose. Token efficiency could be improved.";
        } else {
          return "Length needs improvement. The response is either too short (lacking detail) or too long (verbose). Consider refining the prompt or parameter ranges.";
        }
      },
      color: getScoreColor(metricsLength),
    },
    {
      name: "Coherence",
      score: metricsCoherence,
      icon: "🔗",
      description: "Measures vocabulary richness, sentence variety, and logical flow",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Excellent coherence! Rich vocabulary with diverse sentence structures. Ideas flow logically with good use of transition words. Minimal repetition detected.";
        } else if (score >= 0.5) {
          return "Moderate coherence. Some vocabulary variety but could use more diverse sentence structures. Consider using more transition words to connect ideas.";
        } else {
          return "Low coherence. Limited vocabulary diversity, repetitive phrasing, or poor logical flow. The response may feel disjointed or monotonous.";
        }
      },
      color: getScoreColor(metricsCoherence),
    },
    {
      name: "Structure",
      score: metricsStructure,
      icon: "🏗️",
      description: "Analyzes organization, paragraphs, intro/conclusion, lists, and headings",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Excellent structure! Well-organized with clear introduction and conclusion. Good use of paragraphs, lists, or headings to break down information logically.";
        } else if (score >= 0.5) {
          return "Moderate structure. Has basic organization but lacks clear intro/conclusion or could use better paragraph breaks. Consider adding lists or headings.";
        } else {
          return "Poor structure. The response is poorly organized - may be a single block of text or lack clear beginning/end. Needs better formatting and logical sections.";
        }
      },
      color: getScoreColor(metricsStructure),
    },
    {
      name: "Readability",
      score: metricsReadability,
      icon: "👁️",
      description: "Uses Flesch Reading Ease and syllable complexity analysis",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Excellent readability! Clear, accessible language at a standard reading level. Balanced sentence length and syllable complexity. Easy to understand.";
        } else if (score >= 0.5) {
          return "Moderate readability. Some complex sentences or advanced vocabulary. Most readers can understand it but may need to re-read some parts.";
        } else {
          return "Low readability. Dense, complex sentences with advanced vocabulary. May be too technical or convoluted for most readers. Consider simplifying.";
        }
      },
      color: getScoreColor(metricsReadability),
    },
    {
      name: "Completeness",
      score: metricsCompleteness,
      icon: "✓",
      description: "Checks for proper endings, cutoffs, and content density",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Complete response! Ends naturally with proper punctuation. No mid-sentence cutoffs or abrupt endings. Good information density throughout.";
        } else if (score >= 0.5) {
          return "Mostly complete. May have a somewhat abrupt ending or lower information density. The response covers the topic but could be more thorough.";
        } else {
          return "Incomplete response. May have been cut off mid-sentence, ends abruptly, or lacks substance. Consider increasing maxTokens parameter.";
        }
      },
      color: getScoreColor(metricsCompleteness),
    },
    {
      name: "Specificity",
      score: metricsSpecificity,
      icon: "🎯",
      description: "Evaluates use of numbers, proper nouns, examples, and concrete details",
      interpretation: (score) => {
        if (score >= 0.8) {
          return "Highly specific! Rich with concrete details, numbers, proper nouns, and examples. The response provides actionable, precise information.";
        } else if (score >= 0.5) {
          return "Moderately specific. Has some concrete details but could use more examples, numbers, or specific references to be more actionable.";
        } else {
          return "Generic response. Lacks specific details, numbers, or examples. The answer is abstract or vague. Consider refining the prompt for more specific output.";
        }
      },
      color: getScoreColor(metricsSpecificity),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-700 mb-3">
        Quality Metrics Breakdown
      </div>
      {metrics.map((metric) => {
        const isExpanded = expandedMetric === metric.name;
        const scorePercent = Math.round(metric.score * 100);

        return (
          <div
            key={metric.name}
            className={`border rounded-lg p-3 transition-all ${metric.color}`}
          >
            {/* Metric Header - Always Visible */}
            <button
              onClick={() =>
                setExpandedMetric(isExpanded ? null : metric.name)
              }
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{metric.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{metric.name}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    {metric.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold">{scorePercent}</div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${getBarColor(
                  metric.score
                )}`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="text-xs leading-relaxed">
                  {metric.interpretation(metric.score)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
