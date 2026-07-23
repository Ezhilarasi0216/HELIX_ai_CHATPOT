import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EmotionState, EmotionHistoryEntry } from '../../types';

interface MoodTrendChartProps {
  history: EmotionHistoryEntry[];
}

const EMOTION_COLORS: Record<keyof EmotionState, string> = {
  Joy: '#f59e0b', // amber-500
  Trust: '#10b981', // emerald-500
  Fear: '#14b8a6', // teal-500
  Surprise: '#0ea5e9', // sky-500
  Sadness: '#6366f1', // indigo-500
  Disgust: '#8b5cf6', // violet-500
  Anger: '#ef4444', // red-500
  Anticipation: '#f97316', // orange-500
};

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ history }) => {
  // Format data: map 0-1 scores to 1-5 intensity scale
  const data = history.map((entry, index) => ({
    step: index + 1,
    ...Object.entries(entry.emotions).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: (value as number) * 5
    }), {})
  }));

  // Only show emotions that have registered some significance (> 0.2 score which is level 1)
  // to prevent the chart from being too cluttered with 8 lines at 0.
  const activeKeys = Object.keys(EMOTION_COLORS).filter(key =>
    history.some(h => (h.emotions[key as keyof EmotionState] || 0) > 0.1)
  ) as (keyof EmotionState)[];

  if (history.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-sm">
        Start chatting to see mood trends
      </div>
    )
  }

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-slate-100 p-2 text-xs">
      <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 px-2">Intensity History (1-5 Scale)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="step" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            itemStyle={{ padding: 0 }}
            formatter={(value: number) => [value.toFixed(1), 'Intensity']}
            labelFormatter={(label) => `Turn ${label}`}
          />
          {activeKeys.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={EMOTION_COLORS[key]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={500}
            />
          ))}
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};