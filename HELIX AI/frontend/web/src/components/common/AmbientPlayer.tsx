import React, { useState, useRef } from 'react';
import { CloudRain, Trees, Volume2, VolumeX } from 'lucide-react';

const SOUNDS = [
   { id: 'rain', label: 'Rain', icon: CloudRain, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b868e16e.mp3' },
   { id: 'forest', label: 'Forest', icon: Trees, url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_0dd5df232b.mp3' },
];

export const AmbientContent: React.FC = () => {
   const [playing, setPlaying] = useState<string | null>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);

   const toggleSound = (sound: typeof SOUNDS[0]) => {
      if (playing === sound.id) {
         audioRef.current?.pause();
         setPlaying(null);
      } else {
         if (audioRef.current) {
            audioRef.current.src = sound.url;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
            setPlaying(sound.id);
         }
      }
   };

   return (
      <div className="space-y-3">
         <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Volume2 className="w-4 h-4" /> Ambient Sounds</h3>
         <div className="flex gap-2">
            <audio ref={audioRef} loop />
            {SOUNDS.map(s => (
               <button
                  key={s.id}
                  onClick={() => toggleSound(s)}
                  className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all border-2 ${playing === s.id
                        ? 'border-indigo-400 bg-white shadow-md text-indigo-700'
                        : 'border-transparent bg-slate-50 hover:bg-white text-slate-500'
                     }`}
               >
                  <s.icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{s.label}</span>
               </button>
            ))}
         </div>
      </div>
   );
};

export const AmbientPlayer: React.FC = () => {
   return (
      <div className="fixed top-20 right-6 z-20 flex flex-col gap-2 md:hidden">
         <AmbientContent />
      </div>
   );
};
