import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';
import Listao from './pages/Listao';
import Prayers from './pages/Prayers';
import Formation from './pages/Formation';
import Liturgy from './pages/Liturgy';
import EventsList from './pages/EventsList';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ejc_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erro ao ler usuário do localStorage", e);
        localStorage.removeItem('ejc_user');
      }
    }
    setIsReady(true);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ejc_user');
    setUser(null);
  };

  if (!isReady) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 italic">Carregando aplicativo...</div>;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/liturgia" element={<Liturgy />} />
          <Route path="/listao" element={<Listao />} />
          <Route path="/oracoes" element={<Prayers />} />
          <Route path="/formacao" element={<Formation />} />
          <Route path="/perfil" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/gamificacao" element={<Gamification user={user} />} />
          <Route path="/eventos" element={<EventsList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;