// The ROI formulas, lifted verbatim out of components/ROICalculator.tsx when the
// two calculators were split onto their own /tools routes. Both the split
// calculators and the original tabbed component call these, so there is exactly
// one definition of each number and the two paths cannot drift apart.
//
// Nothing here was re-derived: same operations, same order, same `Number(x) || 0`
// guards against a NaN reaching the UI.

/** The original assumed automation removes 80% of the manual hours. */
export const AUTOMATION_EFFICIENCY = 0.8;
const MONTHS_PER_YEAR = 12;

export interface AutomationRoiInputs {
  manualHours: number;
  staffRate: number;
  errorRate: number;
}

export interface AutomationRoiResult {
  monthlySavings: number;
  annualSavings: number;
  errorCosts: number;
  hoursSaved: number;
}

export function calcAutomationRoi({ manualHours, staffRate, errorRate }: AutomationRoiInputs): AutomationRoiResult {
  const safeManualHours = Number(manualHours) || 0;
  const safeStaffRate = Number(staffRate) || 0;
  const safeErrorRate = Number(errorRate) || 0;

  const monthlySavings = safeManualHours * safeStaffRate * AUTOMATION_EFFICIENCY;
  const annualSavings = monthlySavings * MONTHS_PER_YEAR;
  const errorCosts = safeManualHours * safeStaffRate * (safeErrorRate / 100);
  // Shown as "Time Saved / Mo"; the original computed this inline in the JSX.
  const hoursSaved = Math.round(safeManualHours * AUTOMATION_EFFICIENCY);

  return { monthlySavings, annualSavings, errorCosts, hoursSaved };
}

export interface CallingRoiInputs {
  monthlyCalls: number;
  missedRate: number;
  ticketSize: number;
  conversionRate: number;
}

export interface CallingRoiResult {
  missedCalls: number;
  recoveredLeads: number;
  monthlyRevenue: number;
  annualRevenue: number;
}

export function calcCallingRoi({ monthlyCalls, missedRate, ticketSize, conversionRate }: CallingRoiInputs): CallingRoiResult {
  const safeMonthlyCalls = Number(monthlyCalls) || 0;
  const safeMissedRate = Number(missedRate) || 0;
  const safeTicketSize = Number(ticketSize) || 0;
  const safeConversionRate = Number(conversionRate) || 0;

  const missedCalls = (safeMonthlyCalls * safeMissedRate) / 100;
  const recoveredLeads = (missedCalls * safeConversionRate) / 100;
  const monthlyRevenue = recoveredLeads * safeTicketSize;
  const annualRevenue = monthlyRevenue * MONTHS_PER_YEAR;

  return { missedCalls, recoveredLeads, monthlyRevenue, annualRevenue };
}
