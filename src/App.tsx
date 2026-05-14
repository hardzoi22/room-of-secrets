import React from 'react';

export default function App() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Room of Secrets</h1>
        <p>Если ты видишь этот текст — приложение работает.</p>
        <p className="text-red-400 mt-6">Если видишь белый экран — пришли скриншот из Console (F12)</p>
      </div>
    </div>
  );
}
