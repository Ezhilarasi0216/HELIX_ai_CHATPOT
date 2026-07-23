import React from 'react';

interface ToggleProps {
   enabled: boolean;
   onChange: (enabled: boolean) => void;
   label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label }) => {
   return (
      <div className="flex items-center gap-3">
         <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`${enabled ? 'bg-indigo-600' : 'bg-slate-200'
               } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
         >
            <span
               aria-hidden="true"
               className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
         </button>
         {label && <span className="text-sm text-slate-700 font-medium">{label}</span>}
      </div>
   );
};
