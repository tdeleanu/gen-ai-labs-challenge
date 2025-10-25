"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
import { useCreateExperiment } from "@/hooks/useExperiments";
import PromptInput from "./PromptInput";
import ParameterControls from "./ParameterControls/ParameterControls";
import ResponseGrid from "./ResponseResults/ResponseGrid";

type ViewMode = "input" | "results";

export default function Main() {
  const [prompt, setPrompt] = useState("");
  const [temperatureMin, setTemperatureMin] = useState(0.3);
  const [temperatureMax, setTemperatureMax] = useState(1.0);
  const [topPMin, setTopPMin] = useState(0.8);
  const [topPMax, setTopPMax] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(500);
  const [viewMode, setViewMode] = useState<ViewMode>("input");

  const { mutate: createExperiment, isPending, isSuccess, data, error } = useCreateExperiment();

  // Switch to results view when data arrives
  useEffect(() => {
    if (isSuccess && data) {
      setViewMode("results");
    }
  }, [isSuccess, data]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      return;
    }

    // Send parameter ranges to backend - backend will generate 4 random combinations
    createExperiment({
      prompt: prompt.trim(),
      parameters: {
        temperatureMin,
        temperatureMax,
        topPMin,
        topPMax,
        maxTokens,
      },
    });
  };

  const hasResults = isSuccess && data;

  return (
    <section id="main-experiment" className="relative min-h-screen px-6 py-20 overflow-hidden">
      {/* Gradient background from white to light blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/50"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-[500px] mx-auto text-center mb-12">
          <h2 className="text-[20px] leading-snug font-medium tracking-tight text-gray-900 lg:text-[28px]">
            {viewMode === "results" ? "Experiment Results" : "Experiment Lab"}
          </h2>
          <p className="mt-2 text-base leading-snug tracking-tight text-gray-600 md:mt-2.5 lg:mt-3 lg:text-xl">
            {viewMode === "results"
              ? "Compare how different parameter combinations affect response quality"
              : "Turn the dials on AI creativity, response length, and precision. See how each parameter shapes the answer."
            }
          </p>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "input" ? (
            <motion.div
              key="input-view"
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 lg:p-10"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                  {/* Header with View Results link */}
                  {hasResults && (
                    <motion.div
                      className="flex items-center justify-between mb-6"
                      variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Ask Anything</h3>
                      <button
                        onClick={() => setViewMode("results")}
                        className="text-sm font-medium text-[#4A68D6] hover:text-[#3B59C5] transition-colors"
                      >
                        View Results →
                      </button>
                    </motion.div>
                  )}

                  <div className="space-y-8">
                    {/* Prompt Input */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                      }}
                    >
                      <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                      />
                    </motion.div>

                    {/* Parameter Controls */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                      }}
                    >
                      <ParameterControls
                        temperatureMin={temperatureMin}
                        temperatureMax={temperatureMax}
                        topPMin={topPMin}
                        topPMax={topPMax}
                        maxTokens={maxTokens}
                        onTemperatureMinChange={setTemperatureMin}
                        onTemperatureMaxChange={setTemperatureMax}
                        onTopPMinChange={setTopPMin}
                        onTopPMaxChange={setTopPMax}
                        onMaxTokensChange={setMaxTokens}
                      />
                    </motion.div>

                    {/* Generate Button */}
                    <motion.div
                      className="flex justify-center"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                      }}
                    >
                      <button
                        onClick={handleGenerate}
                        disabled={isPending || !prompt.trim()}
                        className="relative overflow-hidden rounded-[20px] px-8 py-4 text-base font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4),0_16px_64px_rgba(74,104,214,0.3)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5),0_20px_80px_rgba(74,104,214,0.4)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Blurred border overlay */}
                        <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1.5px]" aria-hidden="true">
                          <span className="absolute -top-px -left-px z-20 h-full w-full border-2 border-white/30 rounded-[20px]"></span>
                        </span>

                        {/* Shimmer effect */}
                        {!isPending && (
                          <span className="absolute -top-4 -left-12 h-[153px] w-[54px] opacity-50 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl group-hover:animate-shimmer" aria-hidden="true"></span>
                        )}

                        <span className="relative z-30 flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="sr-only">Generating experiment with 4 different parameter combinations, please wait...</span>
                              Generating 4 responses...
                            </>
                          ) : (
                            "Generate 4 Responses"
                          )}
                        </span>
                      </button>
                    </motion.div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                      >
                        <span className="font-semibold">Error:</span> {error.message}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              className="max-w-7xl mx-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Try Another Prompt Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setViewMode("input")}
                  className="text-sm font-medium text-[#4A68D6] hover:text-[#3B59C5] transition-colors flex items-center gap-1"
                >
                  ← Try another prompt
                </button>
                <Link
                  href="/experiments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 font-medium text-gray-700 px-3 py-1.5 text-sm"
                >
                  <span>Export</span>
                  <HiExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Results */}
              {hasResults && (
                <ResponseGrid responses={data.responses} maxTokens={maxTokens} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
