import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MonthlyPoint } from '../../types';

interface Props {
  data: MonthlyPoint[];
  loading: boolean;
}

function formatMonth(m: string) {
  const [year, month] = m.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

export default function MonthlyChart({ data, loading }: Props) {
  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));
  const max = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Monthly Trend</h3>
      {loading ? (
        <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}
              formatter={(val) => [`${val} jobs`, 'Jobs']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.count === max ? '#059669' : '#d1fae5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
