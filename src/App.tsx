import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
        Room of Secrets
      </h1>
      
      <div className="bg-[#1C1C1F] p-6 rounded-2xl border border-white/10 text-center space-y-4">
        <p className="text-gray-400">✅ Приложение работает!</p>
        
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition"
        >
          Нажми меня: {count}
        </button>
        
        <p className="text-xs text-gray-500">
          Telegram WebApp ready
        </p>
      </div>
    </div>
  );
}
