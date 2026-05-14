import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';   // или globals.css, если у тебя так называется

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
