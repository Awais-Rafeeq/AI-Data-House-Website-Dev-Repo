import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, Loader2, Zap } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../../lib/n8n';
import SliderInput from './SliderInput';
import { calcCallingRoi } from './roiMath';

/**
 * The "voice" half of the original tabbed ROICalculator, now a standalone tool
 * at /tools/ai-calling-roi-calculator. Same inputs, same defaults, same slider
 * bounds, and the same numbers — the arithmetic lives in roiMath.ts and is
 * shared with the original component.
 */
const AiCallingRoiCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [monthlyCalls, setMonthlyCalls] = useState(300);
  const [missedRate, setMissedRate] = useState(40);
  const [ticketSize, setTicketSize] = useState(1000);
  const [conversionRate, setConversionRate] = useState(20);

  const results = useMemo(
    () => calcCallingRoi({ monthlyCalls, missedRate, ticketSize, conversionRate }),
    [monthlyCalls, missedRate, ticketSize, conversionRate],
  );

  const handleSecureRevenue = async () => {
    setIsSubmitting(true);
    try {
      await sendToN8n(ACTIONS.ROI_CALC, {
        type: 'voice',
        metrics: results,
        parameters: { monthlyCalls, missedRate, ticketSize, conversionRate },
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
            <SliderInput label="Monthly Inbound Calls" value={monthlyCalls} onChange={setMonthlyCalls} min={50} max={5000} step={50} unit="calls" />
            <SliderInput label="Currently Missed/Unanswered" value={missedRate} onChange={setMissedRate} min={5} max={90} unit="%" />
            <SliderInput label="Avg. Customer Value (LTV)" value={ticketSize} onChange={setTicketSize} min={100} max={10000} step={100} unit="$" />
            <SliderInput label="Conversion Rate (AI Response)" value={conversionRate} onChange={setConversionRate} min={5} max={50} unit="%" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none" aria-hidden="true"><Zap size={200} /></div>

          <div className="relative z-10">
            <p className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-2">Estimated Impact</p>
            <div className="space-y-8">
              <div>
                <p className="text-5xl lg:text-6xl font-black text-white mb-2">${results.annualRevenue.toLocaleString()}</p>
                <p className="text-slate-400 font-bold">Additional Annual Revenue Captured</p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-black text-emerald-400">{results.recoveredLeads.toFixed(0)}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">New Customers / Mo</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">${results.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Monthly Growth</p>
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

export default AiCallingRoiCalculator;
