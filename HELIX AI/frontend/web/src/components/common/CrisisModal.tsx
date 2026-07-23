import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-l-8 border-red-500 animate-zoom-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Crisis Intervention Required</h2>
            <p className="text-gray-600 mb-4">
              It sounds like you're going through a very difficult time. I am an AI and cannot provide medical help, but support is available immediately.
            </p>
            
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-700">Call or Text 988 (USA)</span>
              </div>
              <p className="text-sm text-red-600">Suicide & Crisis Lifeline - 24/7, Free, Confidential</p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              I understand, continue session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};