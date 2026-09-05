import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, Loader2, Zap } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../../lib/n8n';
import SliderInput from './SliderInput';
import { calcAutomationRoi } from './roiMath';

/**
 * The "workflow" half of the original tabbed ROICalculator, now a standalone
 * tool at /tools/automation-roi-calculator. Same inputs, same defaults, same
 * slider bounds, and the same numbers — the arithmetic lives in roiMath.ts and
 * is shared with the original component.
 */
const AutomationRoiCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [manualHours, setManualHours] = useState(40);
  const [staffRate, setStaffRate] = useState(50);
  const [errorRate, setErrorRate] = useState(5);

  const results = useMemo(
    () => calcAutomationRoi({ manualHours, staffRate, errorRate }),
    [manualHours, staffRate, errorRate],
  );

  const handleSecureRevenue = async () => {
    setIsSubmitting(true);
    try {
      await sendToN8n(ACTIONS.ROI_CALC, {
        type: 'workflow',
        metrics: results,
        parameters: { manualHours, staffRate, errorRate },
      });
    } catch (e) {
      console.error('Failed to send ROI data', e);
    } finally {
      setIsSubmitting(false);
      navigate('/contact');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-8 lg:p-12 grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Calculator className="w-5 h-5" /></div>
            <h2 className="text-2xl font-black text-slate-900">Configure Parameters</h2>
          </div>

          <div className="space-y-6">
            <SliderInput label="Monthly Manual Task Hours" value={manualHours} onChange={setManualHours} min={10} max={500} unit="hours" />
            <SliderInput label="Avg. Hourly Staff Rate" value={staffRate} onChange={setStaffRate} min={15} max={200} unit="$/hr" />
            <SliderInput label="Manual Error Rate" value={errorRate} onChange={setErrorRate} min={1} max={25} unit="%" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none" aria-hidden="true"><Zap size={200} /></div>

          <div className="relative z-10">
            <p className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-2">Estimated Impact</p>
            <div className="space-y-8">
              <div>
                <p className="text-5xl lg:text-6xl font-black text-white mb-2">${results.annualSavings.toLocaleString()}</p>
                <p className="text-slate-400 font-bold">Annual Operational Savings</p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-black text-emerald-400">{results.hoursSaved} hrs</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Time Saved / Mo</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">${results.monthlySavings.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Direct Profit Lift</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSecureRevenue}
            disabled={isSubmitting}
            className="relative z-10 mt-12 w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-lg group shadow-2xl shadow-emerald-900/40 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>Processing <Loader2 className="animate-spin" /></>
            ) : (
              <>Secure This Revenue <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationRoiCalculator;
