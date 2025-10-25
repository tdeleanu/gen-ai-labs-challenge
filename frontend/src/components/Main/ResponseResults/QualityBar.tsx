interface QualityBarProps {
  score: number;
}

export default function QualityBar({ score }: QualityBarProps) {
  const getColorClass = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getColorClass()}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span className="font-semibold">{score.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
