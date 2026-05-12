declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        showPopup: (params: { title?: string; message: string; buttons?: { id: string; text: string; type?: string }[] }) => Promise<string>;
        showAlert: (message: string) => Promise<void>;
        showConfirm: (message: string) => Promise<boolean>;
        openInvoice: (url: string) => Promise<string>;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        platform: string;
        version: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
      };
    };
  }
}

export function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.warn('Telegram WebApp not detected — running in standalone mode');
    return null;
  }

  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
  tg.setHeaderColor('#0A0A0B');
  tg.setBackgroundColor('#050506');

  // Haptic feedback on interactions
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      tg.HapticFeedback?.impactOccurred('light');
    }
  });

  return tg;
}

export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp;
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
}

export function getReferralCode(): string | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.start_param;
}

export function hapticSuccess() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
}

export function hapticError() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
}

export function hapticWarning() {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning');
}
