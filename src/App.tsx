// src/App.tsx — ВРЕМЕННЫЙ ТЕСТ
import React from 'react';

export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#050506', 
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>✅ App is working!</h1>
      <p style={{ color: '#888' }}>Если видите это — проблема в импортах</p>
    </div>
  );
}
