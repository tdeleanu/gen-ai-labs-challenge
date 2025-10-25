import { motion } from "framer-motion";
import RangeSlider from "./RangeSlider";
import SingleSlider from "./SingleSlider";

interface ParameterControlsProps {
  temperatureMin: number;
  temperatureMax: number;
  topPMin: number;
  topPMax: number;
  maxTokens: number;
  onTemperatureMinChange: (value: number) => void;
  onTemperatureMaxChange: (value: number) => void;
  onTopPMinChange: (value: number) => void;
  onTopPMaxChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function ParameterControls({
  temperatureMin,
  temperatureMax,
  topPMin,
  topPMax,
  maxTokens,
  onTemperatureMinChange,
  onTemperatureMaxChange,
  onTopPMinChange,
  onTopPMaxChange,
  onMaxTokensChange,
}: ParameterControlsProps) {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Temperature */}
      <motion.div variants={itemVariants}>
        <RangeSlider
          label="Temperature"
          minValue={temperatureMin}
          maxValue={temperatureMax}
          min={0}
          max={1.5}
          step={0.1}
          onMinChange={onTemperatureMinChange}
          onMaxChange={onTemperatureMaxChange}
          formatValue={(v) => v.toFixed(1)}
          infoTitle="Temperature (0-1.5)"
          infoDescription="Controls creativity. Lower = focused and consistent. Higher = creative and varied."
        />
      </motion.div>

      {/* Top P */}
      <motion.div variants={itemVariants}>
        <RangeSlider
          label="Top P"
          minValue={topPMin}
          maxValue={topPMax}
          min={0}
          max={1}
          step={0.05}
          onMinChange={onTopPMinChange}
          onMaxChange={onTopPMaxChange}
          formatValue={(v) => v.toFixed(2)}
          infoTitle="Top P (0-1)"
          infoDescription="Controls word choice diversity. Lower = more predictable. Higher = more varied vocabulary."
        />
      </motion.div>

      {/* Max Tokens */}
      <motion.div variants={itemVariants}>
        <SingleSlider
          label="Max Response Length"
          value={maxTokens}
          min={100}
          max={1000}
          step={50}
          onChange={onMaxTokensChange}
          formatLabel={(v) => `${v} tokens (~${Math.round((v * 4) / 3)} words)`}
          formatValue={(v) => v.toString()}
          infoTitle="Max Tokens (100-1000)"
          infoDescription="Maximum length of the response. ~4 characters = 1 token. Higher = longer responses."
        />
      </motion.div>
    </motion.div>
  );
}
