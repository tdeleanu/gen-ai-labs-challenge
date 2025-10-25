import InfoTooltip from "../InfoTooltip";

interface SingleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  formatValue?: (value: number) => string;
  infoTitle: string;
  infoDescription: string;
  showBorder?: boolean;
}

export default function SingleSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatLabel = (v) => v.toString(),
  formatValue = (v) => v.toString(),
  infoTitle,
  infoDescription,
  showBorder = true,
}: SingleSliderProps) {
  return (
    <div className={showBorder ? "pb-6 border-b border-gray-200" : ""}>
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        <InfoTooltip title={infoTitle} description={infoDescription} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">{formatLabel(value)}</label>
          <span className="text-sm font-semibold text-gray-900">{formatValue(value)}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer"
          style={{
            '--value': `${((value - min) / (max - min)) * 100}%`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
