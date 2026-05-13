import { useApp } from '@/store';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import SmokeScreen from '@/components/SmokeScreen';
import RatingScreen from '@/components/RatingScreen';
import ToastContainer from '@/components/ToastContainer';
import LobbyPage from '@/pages/LobbyPage';
import ChatPage from '@/pages/ChatPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ProfilePage from '@/pages/ProfilePage';

function AppContent() {
  const { activeTab } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case 'lobby': return <LobbyPage />;
      case 'chat': return <ChatPage />;
      case 'reviews': return <ReviewsPage />;
      case 'profile': return <ProfilePage />;
      default: return <LobbyPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#f3f4f6] relative flex flex-col overflow-hidden select-none font-sans bg-noise">
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-[#19142e] to-transparent opacity-40 pointer-events-none z-0" />
      
      <SmokeScreen />
      <RatingScreen />
      <ToastContainer />

      <div className="relative z-10 flex flex-col h-[100dvh] w-full lg:max-w-md lg:mx-auto lg:shadow-2xl lg:border-x lg:border-white/[0.03] lg:my-4 lg:h-[calc(100dvh-2rem)] lg:rounded-3xl overflow-hidden bg-[#0A0A0B]">
        <Header />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderPage()}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
