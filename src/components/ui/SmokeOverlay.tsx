import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface SmokeOverlayProps {
  show: boolean;
  type: 'match' | 'exit' | 'burn' | 'init';
  message: string;
}

export const SmokeOverlay: React.FC<SmokeOverlayProps> = ({ show, type, message }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/95 z-[999] flex flex-col items-center justify-center backdrop-blur-2xl">
      <div className="relative flex flex-col items-center">
        <div className="w-40 h-40 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        
        {type === 'burn' ? (
          <Flame className="w-20 h-20 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        ) : (
          <Sparkles className="w-20 h-20 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        )}
      </div>

      <h2 className="mt-12 text-2xl font-bold text-center tracking-wide px-6">
        {message}
      </h2>
    </div>
  );
};