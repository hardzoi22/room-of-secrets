import React from 'react';

export default function App() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>
        Room of Secrets
      </h1>
      <p style={{ color: '#888', fontSize: '18px' }}>
        Если ты видишь этот текст — приложение работает.
      </p>
      <p style={{ color: '#ff4444', marginTop: '40px', fontSize: '16px' }}>
        Если экран всё ещё белый — проблема в CSS/Tailwind
      </p>
    </div>
  );
}
