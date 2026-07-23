import React from 'react';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   RadialLinearScale,
   Filler
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { useEmotion } from '../../context/EmotionContext';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   RadialLinearScale,
   Title,
   Tooltip,
   Legend,
   Filler
);

export const MoodChart: React.FC = () => {
   const { emotionHistory, emotions } = useEmotion();

   const lineData = {
      labels: emotionHistory.map(e => new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      datasets: [
         {
            label: 'Joy',
            data: emotionHistory.map(e => e.emotions.Joy),
            borderColor: 'rgb(251, 191, 36)',
            backgroundColor: 'rgba(251, 191, 36, 0.5)',
            tension: 0.4,
         },
         {
            label: 'Calm',
            data: emotionHistory.map(e => e.emotions.Trust), // Mapping Trust to Calm for UI
            borderColor: 'rgb(52, 211, 153)',
            backgroundColor: 'rgba(52, 211, 153, 0.5)',
            tension: 0.4,
         },
         {
            label: 'Stress',
            data: emotionHistory.map(e => e.emotions.Fear),
            borderColor: 'rgb(248, 113, 113)',
            backgroundColor: 'rgba(248, 113, 113, 0.5)',
            tension: 0.4,
         }
      ]
   };

   const radarData = {
      labels: Object.keys(emotions),
      datasets: [
         {
            label: 'Current Mood',
            data: Object.values(emotions),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
         },
      ],
   };

   return (
      <div className="space-y-6">
         <div className="glass-card p-4 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Emotional Trends</h3>
            <div className="h-48">
               <Line options={{ responsive: true, maintainAspectRatio: false, scales: { y: { display: false }, x: { display: false } } }} data={lineData} />
            </div>
         </div>
         <div className="glass-card p-4 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Current State</h3>
            <div className="h-48">
               <Radar options={{ responsive: true, maintainAspectRatio: false, scales: { r: { display: false } } }} data={radarData} />
            </div>
         </div>
      </div>
   );
};
