import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Инициализация Telegram WebApp
const tg = (window as any).Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand(); // Разворачиваем на весь экран
  tg.enableClosingConfirmation(); // Подтверждение закрытия
  // Устанавливаем цвета под тему Telegram (опционально)
  tg.setHeaderColor('#0A0A0B');
  tg.setBackgroundColor('#050506');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
