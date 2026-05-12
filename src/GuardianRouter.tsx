import React, { useEffect, useState } from 'react';
import App from './App';
import ModerationDashboard from './ModerationDashboard';

export default function GuardianRouter() {
  const [route, setRoute] = useState('app');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#moderator') {
        setRoute('moderator');
      } else {
        setRoute('app');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === 'moderator') {
    return <ModerationDashboard />;
  }

  return <App />;
}
