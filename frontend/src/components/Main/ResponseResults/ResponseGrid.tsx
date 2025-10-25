import { motion } from "framer-motion";
import ResponseCard from "./ResponseCard";

interface Response {
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

interface ResponseGridProps {
  responses: Response[];
  maxTokens: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function ResponseGrid({ responses, maxTokens }: ResponseGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {responses.map((response, index) => (
        <motion.div key={response.id} variants={itemVariants}>
          <ResponseCard
            index={index}
            response={response}
            maxTokens={maxTokens}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
