interface RangeSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  formatValue?: (value: number) => string;
  infoTitle: string;
  infoDescription: string;
}

import InfoTooltip from "../InfoTooltip";

export default function RangeSlider({
  label,
  minValue,
  maxValue,
  min,
  max,
  step,
  onMinChange,
  onMaxChange,
  formatValue = (v) => v.toFixed(1),
  infoTitle,
  infoDescription,
}: RangeSliderProps) {
  return (
    <div className="pb-6 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        <InfoTooltip title={infoTitle} description={infoDescription} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-600">Min</label>
            <span className="text-sm font-semibold text-gray-900">{formatValue(minValue)}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={(e) => onMinChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer"
            style={{
              '--value': `${((minValue - min) / (max - min)) * 100}%`
            } as React.CSSProperties}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-600">Max</label>
            <span className="text-sm font-semibold text-gray-900">{formatValue(maxValue)}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={(e) => onMaxChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer"
            style={{
              '--value': `${((maxValue - min) / (max - min)) * 100}%`
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
}
