import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CountryPoint } from '../../types';

interface Props {
  data: CountryPoint[];
  loading: boolean;
}

export default function CountryChart({ data, loading }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Top Countries</h3>
      {loading ? (
        <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
      ) : data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-slate-400 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              width={90}
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.count === max ? '#059669' : '#d1fae5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
