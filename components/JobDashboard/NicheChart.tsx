import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { NichePoint } from '../../types';

const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

interface Props {
  data: NichePoint[];
  loading: boolean;
}

export default function NicheChart({ data, loading }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Niche Breakdown</h3>
      {loading ? (
        <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
      ) : data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-slate-400 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="niche"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}
              formatter={(val, name) => [`${val} jobs`, name]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
