import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('landing'); // landing | login

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0b0d14', color: '#8b8fa3' }}>
        Loading...
      </div>
    );
  }

  if (user) {
    return <Dashboard onPublicSite={() => {}} />;
  }

  if (screen === 'login') {
    return <LoginScreen onBack={() => setScreen('landing')} onSuccess={() => {}} />;
  }

  return <LandingPage onLogin={() => setScreen('login')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
