import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Room of Secrets
        </h1>
        <p className="text-gray-400">✅ Приложение работает!</p>
        <button 
          onClick={() => alert('Кнопка работает!')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition"
        >
          🔮 Войти в комнату
        </button>
      </div>
    </div>
  );
}
