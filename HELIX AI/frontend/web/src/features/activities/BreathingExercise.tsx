import React, { useState, useEffect } from 'react';
import { Wind, X } from 'lucide-react';

export const BreathingContent: React.FC = () => {
   const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

   useEffect(() => {
      const interval = setInterval(() => {
         setPhase((prev) => {
            if (prev === 'Inhale') return 'Hold';
            if (prev === 'Hold') return 'Exhale';
            return 'Inhale';
         });
      }, 4000);

      return () => clearInterval(interval);
   }, []);

   return (
      <div className="flex flex-col items-center py-2">
         <div className={`w-20 h-20 rounded-full border-4 border-indigo-200 flex items-center justify-center transition-all duration-[4000ms] ${phase === 'Inhale' ? 'scale-110 bg-indigo-50' : phase === 'Exhale' ? 'scale-90 bg-transparent' : 'scale-105 bg-indigo-100'}`}>
            <span className="text-indigo-600 font-bold text-xs">{phase}</span>
         </div>
         <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold italic">Box Breathing</div>
      </div>
   );
};

export const BreathingWidget: React.FC = () => {
   const [isOpen, setIsOpen] = useState(false);

   if (!isOpen) {
      return (
         <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 p-3 rounded-full glass hover:bg-white/20 transition-all shadow-lg animate-float z-20 font-medium text-xs text-indigo-700 flex items-center gap-2 md:hidden"
         >
            <Wind className="w-4 h-4" /> Breathe
         </button>
      );
   }

   return (
      <div className="fixed bottom-24 right-6 w-64 glass p-6 rounded-2xl shadow-2xl z-20 animate-fade-in border-t-4 border-indigo-300 md:hidden">
         <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-indigo-900 flex items-center gap-2"><Wind className="w-4 h-4" /> Relax</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
         </div>
         <BreathingContent />
      </div>
   );
};
