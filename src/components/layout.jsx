// Apex Professores — Layout Router (handles auth state)

import React from 'react';
import { useUser } from '@clerk/react';
import AuthScreen from './auth.jsx';
import App from './app.jsx';

const LoadingScreen = () => (
  <div className="apex-grad" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  }}>
    <div style={{
      textAlign: 'center',
      color: '#64748b',
    }}>
      <div style={{
        fontSize: 16,
        fontWeight: 500,
      }}>
        Verificando autenticação...
      </div>
    </div>
  </div>
);

export default function Layout() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <AuthScreen />;
  }

  return <App />;
}
