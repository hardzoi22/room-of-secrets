import React from 'react';
import { Sparkles, Compass, Flame } from 'lucide-react';
import { useApp } from '@/store';

export default function SmokeScreen() {
  const { showSmokeScreen, smokeType, smokeMessage } = useApp();

  if (!showSmokeScreen) return null;

  return (
    <div className="fixed inset-0 bg-[#050506]/95 z-[999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#B388FF]/10 blur-[80px] animate-pulse-ring-slow" />
      <div className="absolute w-[180px] h-[180px] rounded-full bg-[#00E5FF]/10 blur-[50px] animate-pulse-ring-fast" />

      <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-center">
        {smokeType === 'burn' ? (
          <>
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center animate-bounce shadow-glow-purple">
              <Flame className="w-10 h-10 text-rose-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-300 to-rose-400 tracking-wider">СЖИГАНИЕ МОСТОВ</h2>
            <p className="text-gray-400 max-w-sm text-sm">Вся история переписки безвозвратно удаляется.</p>
          </>
        ) : smokeType === 'match' ? (
          <>
            <div className="w-24 h-24 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="w-12 h-12 text-[#B388FF]" />
            </div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#B388FF] to-cyan-400 tracking-wider">СОЕДИНЕНИЕ...</h2>
            <p className="text-gray-400 max-w-sm text-sm">{smokeMessage || 'Синхронизируем каналы...'}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
              <Compass className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#00E5FF] tracking-wider text-glow-cyan">РАССЕИВАНИЕ</h2>
            <p className="text-gray-400 max-w-sm text-sm">Комната закрывается. Вы возвращаетесь в безопасную зону.</p>
          </>
        )}
      </div>
    </div>
  );
}
