import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider, useApp } from "./store";
import { initTelegramWebApp } from "./utils/telegram";

// Initialize Telegram WebApp
initTelegramWebApp();

// Timer component to handle chat countdown
function TimerHandler() {
  const { chatSessionActive, chatTimer, setChatTimer, exitChat } = useApp();

  useEffect(() => {
    if (!chatSessionActive || chatTimer <= 0) return;

    const interval = setInterval(() => {
      setChatTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          exitChat(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [chatSessionActive, chatTimer, setChatTimer, exitChat]);

  // Media timer
  const { mediaUnblocked, mediaTimer, setMediaUnblocked, setMediaTimer } = useApp();

  useEffect(() => {
    if (!mediaUnblocked || mediaTimer === null || mediaTimer <= 0) return;

    const interval = setInterval(() => {
      setMediaTimer((prev: number | null) => {
        if (prev && prev <= 1) {
          setMediaUnblocked(false);
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mediaUnblocked, mediaTimer, setMediaTimer, setMediaUnblocked]);

  return null;
}

function Root() {
  return (
    <StrictMode>
      <AppProvider>
        <TimerHandler />
        <App />
      </AppProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
