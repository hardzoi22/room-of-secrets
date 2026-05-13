import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initTelegramWebApp } from "./utils/telegram";

// Инициализируем Telegram WebApp при старте
initTelegramWebApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
