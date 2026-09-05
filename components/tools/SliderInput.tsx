import React from 'react';

/**
 * The labelled range input both ROI calculators use. Moved here unchanged when
 * the calculators were split onto their own /tools routes, so the original
 * tabbed ROICalculator and the two split tools all render identical controls.
 */
const SliderInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}> = ({ label, value, onChange, min, max, step = 1, unit }) => {
  const id = `slider-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <label htmlFor={id} className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg whitespace-nowrap">
          {unit === '$' || unit === '$/hr' ? `$${value}` : `${value}${unit === '%' ? '%' : ''}`}
          {unit === 'calls' || unit === 'hours' ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
};

export default SliderInput;
