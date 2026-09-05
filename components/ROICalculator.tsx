
import React, { useState, useMemo } from 'react';
import { ArrowRight, Calculator, Zap, PhoneCall, Workflow, Loader2 } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import SliderInput from './tools/SliderInput';
import { calcAutomationRoi, calcCallingRoi } from './tools/roiMath';

/**
 * The original tabbed calculator. The two halves now also ship as standalone
 * tools (/tools/automation-roi-calculator, /tools/ai-calling-roi-calculator);
 * all three share the formulas in tools/roiMath.ts and the control in
 * tools/SliderInput.tsx, so none of them can drift from the others.
 */
const ROICalculator: React.FC = () => {
  const [calcType, setCalcType] = useState<'voice' | 'workflow'>('voice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Voice Calculator State
  const [monthlyCalls, setMonthlyCalls] = useState(300);
  const [missedRate, setMissedRate] = useState(40); // 40%
  const [ticketSize, setTicketSize] = useState(1000);
  const [conversionRate, setConversionRate] = useState(20); // 20% of recovered calls

  // Workflow Calculator State
  const [manualHours, setManualHours] = useState(40);
  const [staffRate, setStaffRate] = useState(50);
  const [errorRate, setErrorRate] = useState(5);

  const voiceResults = useMemo(
    () => calcCallingRoi({ monthlyCalls, missedRate, ticketSize, conversionRate }),
    [monthlyCalls, missedRate, ticketSize, conversionRate],
  );

  const workflowResults = useMemo(
    () => calcAutomationRoi({ manualHours, staffRate, errorRate }),
    [manualHours, staffRate, errorRate],
  );

  const handleSecureRevenue = async () => {
    setIsSubmitting(true);
    const metrics = calcType === 'voice' ? voiceResults : workflowResults;
    
    try {
      // Send the calculation data to n8n
      await sendToN8n(ACTIONS.ROI_CALC, {
        type: calcType,
        metrics: metrics,
        parameters: calcType === 'voice' 
          ? { monthlyCalls, missedRate, ticketSize, conversionRate }
          : { manualHours, staffRate, errorRate }
      });
    } catch (e) {
      console.error("Failed to send ROI data", e);
    } finally {
      setIsSubmitting(false);
      // Redirect to contact page to capture the lead
      window.location.hash = '#/contact';
    }
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden max-w-5xl mx-auto">
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setCalcType('voice')}
          className={`flex-1 py-6 flex items-center justify-center gap-3 font-bold transition-all ${calcType === 'voice' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <PhoneCall className="w-5 h-5" /> AI Calling ROI
        </button>
        <button 
          onClick={() => setCalcType('workflow')}
          className={`flex-1 py-6 flex items-center justify-center gap-3 font-bold transition-all ${calcType === 'workflow' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Workflow className="w-5 h-5" /> Automation ROI
        </button>
      </div>

      <div className="p-8 lg:p-12 grid lg:grid-cols-2 gap-16">
        {/* Input Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Calculator className="w-5 h-5" /></div>
            <h3 className="text-2xl font-black">Configure Parameters</h3>
          </div>

          {calcType === 'voice' ? (
            <div className="space-y-6">
              <SliderInput label="Monthly Inbound Calls" value={monthlyCalls} onChange={setMonthlyCalls} min={50} max={5000} step={50} unit="calls" />
              <SliderInput label="Currently Missed/Unanswered" value={missedRate} onChange={setMissedRate} min={5} max={90} unit="%" />
              <SliderInput label="Avg. Customer Value (LTV)" value={ticketSize} onChange={setTicketSize} min={100} max={10000} step={100} unit="$" />
              <SliderInput label="Conversion Rate (AI Response)" value={conversionRate} onChange={setConversionRate} min={5} max={50} unit="%" />
            </div>
          ) : (
            <div className="space-y-6">
              <SliderInput label="Monthly Manual Task Hours" value={manualHours} onChange={setManualHours} min={10} max={500} unit="hours" />
              <SliderInput label="Avg. Hourly Staff Rate" value={staffRate} onChange={setStaffRate} min={15} max={200} unit="$/hr" />
              <SliderInput label="Manual Error Rate" value={errorRate} onChange={setErrorRate} min={1} max={25} unit="%" />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={200} /></div>
          
          <div className="relative z-10">
            <p className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-2">Estimated Impact</p>
            {calcType === 'voice' ? (
              <div className="space-y-8">
                <div>
                  <p className="text-6xl font-black text-white mb-2">${voiceResults.annualRevenue.toLocaleString()}</p>
                  <p className="text-slate-400 font-bold">Additional Annual Revenue Captured</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-black text-emerald-400">{voiceResults.recoveredLeads.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">New Customers / Mo</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-400">${voiceResults.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Monthly Growth</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="text-6xl font-black text-white mb-2">${workflowResults.annualSavings.toLocaleString()}</p>
                  <p className="text-slate-400 font-bold">Annual Operational Savings</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-black text-emerald-400">{workflowResults.hoursSaved} hrs</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Time Saved / Mo</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-400">${workflowResults.monthlySavings.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Direct Profit Lift</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleSecureRevenue}
            disabled={isSubmitting}
            className="mt-12 w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-lg group shadow-2xl shadow-emerald-900/40 disabled:opacity-70"
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

export default ROICalculator;
