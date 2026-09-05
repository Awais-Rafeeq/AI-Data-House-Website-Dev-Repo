import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyPoint } from '../../types';

interface Props {
  data: DailyPoint[];
  loading: boolean;
}

function formatDay(day: string) {
  const d = new Date(day + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DailyTrendChart({ data, loading }: Props) {
  const chartData = data.map((d) => ({ ...d, label: formatDay(d.day) }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Daily Job Volume</h3>
      {loading ? (
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
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
              labelStyle={{ color: '#475569', fontWeight: 600 }}
              itemStyle={{ color: '#059669' }}
              formatter={(val) => [`${val} jobs`, 'Jobs']}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#059669"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
