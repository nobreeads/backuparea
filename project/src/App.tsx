import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Aulas } from './components/Aulas';
import { Extras } from './components/Extras';
import { Progresso } from './components/Progresso';
import { FAQ } from './components/FAQ';
import { Configuracoes } from './components/Configuracoes';
import { SupportWidget } from './components/SupportWidget';
import { ThemeToggle } from './components/ThemeToggle';
import { storage } from './utils/storage';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const savedUsername = storage.getUsername();
    if (savedUsername) {
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard username={username} onNavigate={setCurrentPage} />;
      case 'aulas':
        return <Aulas username={username} />;
      case 'extras':
        return <Extras username={username} />;
      case 'progresso':
        return <Progresso username={username} />;
      case 'faq':
        return <FAQ />;
      case 'configuracoes':
        return <Configuracoes username={username} onLogout={handleLogout} />;
      default:
        return <Dashboard username={username} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070707] flex transition-colors duration-300">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        username={username}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Header username={username} onLogout={handleLogout} />
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
      <SupportWidget />
      <ThemeToggle />
    </div>
  );
}

export default App;
