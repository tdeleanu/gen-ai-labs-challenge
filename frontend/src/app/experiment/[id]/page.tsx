"use client";

import { use } from "react";
import Link from "next/link";
import { useExperimentById } from "@/hooks/useExperiments";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResponseGrid from "@/components/Main/ResponseResults/ResponseGrid";
import { ExportDropdown } from "@/components/ui/ExportDropdown";

export default function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: experiment, isLoading, error } = useExperimentById(resolvedParams.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/50">
      <Navbar />

      <main className="flex-1 px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4A68D6] hover:text-[#3B59C5] transition-colors mb-6"
            aria-label="Back to experiments list"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Experiments
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center" role="status" aria-live="polite">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-[#4A68D6] rounded-full" aria-hidden="true"></div>
              <p className="mt-4 text-gray-600">Loading experiment...</p>
              <span className="sr-only">Loading experiment details, please wait...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6" role="alert" aria-live="assertive">
              <p className="text-red-700">
                <span className="font-semibold">Error:</span> {error.message}
              </p>
            </div>
          )}

          {/* Experiment Details */}
          {experiment && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Experiment
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      {experiment.prompt}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Created: {formatDate(experiment.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>{experiment.responses.length} responses generated</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <ExportDropdown experiment={experiment} variant="default" size="md" />
                  </div>
                </div>
              </div>

              {/* Responses Grid */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generated Responses
                </h2>
                <ResponseGrid
                  responses={experiment.responses}
                  maxTokens={experiment.responses[0]?.maxTokens || 500}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
