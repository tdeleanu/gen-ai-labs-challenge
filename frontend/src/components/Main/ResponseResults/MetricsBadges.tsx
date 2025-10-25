interface MetricsBadgesProps {
  temperature: number;
  topP: number;
  maxTokens: number;
}

export default function MetricsBadges({
  temperature,
  topP,
  maxTokens,
}: MetricsBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
        Temp: {temperature}
      </span>
      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
        Top P: {topP}
      </span>
      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">
        Tokens: {maxTokens}
      </span>
    </div>
  );
}
