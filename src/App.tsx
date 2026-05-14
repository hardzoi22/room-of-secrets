import React, { useState } from 'react';

export default function App() {
  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Room of Secrets
        </h1>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Добро пожаловать</h2>
          <p className="text-gray-400 text-lg">Приложение успешно загружено</p>
        </div>
      </div>
    </div>
  );
}
