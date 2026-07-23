import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { EmotionState } from '../../types';

interface EmotionRadarProps {
  data: EmotionState;
}

export const EmotionRadar: React.FC<EmotionRadarProps> = ({ data }) => {
  const chartData = Object.keys(data).map((key) => ({
    subject: key,
    A: (data[key as keyof EmotionState] || 0) * 100, // Scale to 0-100 for display
    fullMark: 100,
  }));

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Current Emotional State (Plutchik)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Intensity"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#38bdf8"
            fillOpacity={0.4}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(0)}%`, 'Intensity']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};