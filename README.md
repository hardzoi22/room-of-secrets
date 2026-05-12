# Room of Secrets

Анонимный чат 1-на-1 внутри Telegram Mini App.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

## 📦 Сборка

```bash
npm run build
```

## 📱 Платформы

- **Telegram Mini App** — полноэкранный режим, нативная интеграция
- **Десктоп** — центрированная карточка приложения с адаптивным дизайном
- **Мобильный браузер** — responsive, touch-friendly интерфейс

## 🏗️ Архитектура

```
src/
  components/       # UI компоненты
    Header.tsx
    BottomNav.tsx
    SmokeScreen.tsx
    RatingScreen.tsx
    ToastContainer.tsx
    FilterModal.tsx
  pages/           # Страницы приложения
    LobbyPage.tsx
    ChatPage.tsx
    ReviewsPage.tsx
    ProfilePage.tsx
  data/            # Мок-данные
    strangers.ts
  types/           # TypeScript типы
  utils/           # Утилиты
    cn.ts
    time.ts
    telegram.ts
  store.tsx        # Глобальный state (Context API)
  App.tsx          # Главный компонент
  main.tsx         # Точка входа
```

## ✨ Функции

- 🔮 **Поиск собеседника** — анимация соединения, фильтры (пол, возраст, регион)
- 💬 **Чат** — мок-собеседник с AI-ответами по ключевым словам
- ⭐ **Экономика Stars** — деанон (50⭐), медиа (10⭐), продление (15⭐), Room+ (199⭐)
- 🛡️ **Система кармы** — круговой прогресс-бар, реакции (🔥😇🧠💩)
- 🔥 **SOS-кнопка** — мгновенное удаление переписки
- 👤 **Раскрытие личности** — обмен профилями за звёзды
- 👑 **Room+** — подписка с премиум-функциями
- 🔗 **Реферальная программа** — приглашения друзей

## 🔒 Безопасность

- Валидация Telegram initData (заготовка для бэкенда)
- Haptic Feedback для тактильного отклика
- Подтверждение закрытия приложения

## 🛠️ Технологии

- React 19 + TypeScript
- Vite (сборка)
- Tailwind CSS 4 (стили)
- Telegram WebApp SDK
