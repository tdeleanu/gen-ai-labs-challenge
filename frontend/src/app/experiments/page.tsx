"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { useExperimentHistory } from "@/hooks/useExperiments";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ExportDropdown } from "@/components/ui/ExportDropdown";

export default function ExperimentsPage() {
  const router = useRouter();
  const { sessionId } = useSession();
  const { data: experiments, isLoading, error } = useExperimentHistory();

  const handleExperimentClick = (id: string) => {
    router.push(`/experiment/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getAverageScore = (experiment: any) => {
    if (!experiment.responses || experiment.responses.length === 0) return 0;
    const sum = experiment.responses.reduce((acc: number, r: any) => acc + r.metricsOverall, 0);
    return Math.round((sum / experiment.responses.length) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/50">
      <Navbar />

      <main className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-[28px] leading-snug font-medium tracking-tight text-gray-900 lg:text-[36px]">
              Experiment History
            </h1>
            <p className="mt-3 text-base leading-snug tracking-tight text-gray-600 lg:text-xl">
              Review your past experiments and compare AI response quality across different parameters
            </p>
          </div>

          {/* No Session State */}
          {!sessionId && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-5xl mb-4">🔬</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Experiments Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start your first experiment to see your history here. Each experiment generates 4 AI responses with different parameters for quality comparison.
                </p>
                <Link
                  href="/#main-experiment"
                  className="inline-block relative overflow-hidden rounded-[20px] px-8 py-4 text-base font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5)] transition-all duration-300"
                >
                  Start Now
                </Link>
              </div>
            </div>
          )}

          {/* Loading State */}
          {sessionId && isLoading && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center" role="status" aria-live="polite">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-[#4A68D6] rounded-full" aria-hidden="true"></div>
              <p className="mt-4 text-gray-600">Loading experiments...</p>
              <span className="sr-only">Loading your experiment history, please wait...</span>
            </div>
          )}

          {/* Error State */}
          {sessionId && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center" role="alert" aria-live="assertive">
              <p className="text-red-700">
                <span className="font-semibold">Error:</span> {error.message}
              </p>
            </div>
          )}

          {/* Empty State */}
          {sessionId && !isLoading && !error && experiments && experiments.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-5xl mb-4">🔬</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Experiments Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start your first experiment to see your history here. Each experiment generates 4 AI responses with different parameters for quality comparison.
                </p>
                <Link
                  href="/#main-experiment"
                  className="inline-block relative overflow-hidden rounded-[20px] px-8 py-4 text-base font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5)] transition-all duration-300"
                >
                  Start Now
                </Link>
              </div>
            </div>
          )}

          {/* Experiments Table */}
          {sessionId && !isLoading && experiments && experiments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Experiment history">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Prompt
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Responses
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {experiments.map((experiment) => (
                      <tr
                        key={experiment.id}
                        onClick={() => handleExperimentClick(experiment.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleExperimentClick(experiment.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View experiment: ${experiment.prompt.substring(0, 50)}${experiment.prompt.length > 50 ? '...' : ''}`}
                        className="hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A68D6] focus:ring-inset"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {experiment.prompt}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(experiment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {experiment.responses.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="text-lg font-bold text-gray-900">
                              {getAverageScore(experiment)}
                            </div>
                            <div className="ml-1 text-xs text-gray-500">/ 100</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <ExportDropdown experiment={experiment} variant="icon-only" size="sm" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
