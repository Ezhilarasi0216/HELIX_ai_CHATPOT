import React from 'react';

export interface LivePulseProps {
  active: boolean;
  speaking: boolean; // Is the AI speaking?
  listening: boolean; // Is the user speaking?
}

export const LivePulse: React.FC<LivePulseProps> = ({ active, speaking, listening }) => {
  if (!active) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full shadow-lg animate-slide-down">
      <div className="relative flex items-center justify-center w-3 h-3">
         {listening && (
            <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
         )}
         <span className={`relative inline-flex rounded-full w-2 h-2 transition-colors duration-300 ${listening ? 'bg-red-500' : (speaking ? 'bg-green-500' : 'bg-slate-500')}`}></span>
      </div>
      <span className="text-xs font-medium text-white min-w-[60px]">
        {listening ? 'Listening...' : (speaking ? 'Speaking...' : 'Live')}
      </span>
      {speaking && (
          <div className="flex gap-0.5 h-3 items-center">
             {/* Using style for animation delay to ensure staggered effect works reliably without JIT quirks */}
             <div className="w-0.5 bg-green-400 animate-pulse h-2" style={{ animationDuration: '0.6s' }}></div>
             <div className="w-0.5 bg-green-400 animate-pulse h-3" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }}></div>
             <div className="w-0.5 bg-green-400 animate-pulse h-1.5" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }}></div>
          </div>
      )}
    </div>
  );
};