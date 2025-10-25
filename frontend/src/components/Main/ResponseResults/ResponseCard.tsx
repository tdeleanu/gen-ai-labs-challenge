import { useState } from "react";
import ReactMarkdown from "react-markdown";
import MetricsBadges from "./MetricsBadges";
import MetricsBreakdown from "./MetricsBreakdown";

interface ResponseCardProps {
  index: number;
  response: {
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
  };
  maxTokens: number; // Fallback value
}

export default function ResponseCard({ index, response, maxTokens }: ResponseCardProps) {
  // Convert metrics from 0-1 scale to 0-100 scale for display
  const overallScore = Math.round(response.metricsOverall * 100);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Response {index + 1}
          </div>
          <MetricsBadges
            temperature={response.temperature}
            topP={response.topP}
            maxTokens={response.maxTokens}
          />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {overallScore}
          </div>
          <div className="text-xs text-gray-500">Quality</div>
        </div>
      </div>

      {/* Response Text */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-gray-700">Response</div>
          <button
            onClick={handleCopy}
            className="text-xs font-medium text-gray-600 hover:text-[#4A68D6] transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-50"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto pr-2 custom-scrollbar prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
              li: ({ node, ...props }) => <li className="ml-2" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />,
            }}
          >
            {response.text}
          </ReactMarkdown>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <MetricsBreakdown
          metricsLength={response.metricsLength}
          metricsCoherence={response.metricsCoherence}
          metricsStructure={response.metricsStructure}
          metricsReadability={response.metricsReadability}
          metricsCompleteness={response.metricsCompleteness}
          metricsSpecificity={response.metricsSpecificity}
        />
      </div>
    </div>
  );
}
