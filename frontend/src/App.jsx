import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Detector from './pages/Detector';
import BatchScanner from './pages/BatchScanner';
import ScamRadar from './pages/ScamRadar';
import About from './pages/About';
import ApiStatus from './pages/ApiStatus';
import Toast from './components/Toast';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('prediction_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync prediction logs to local storage
  useEffect(() => {
    localStorage.setItem('prediction_history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const addHistoryItem = (item) => {
    // Save prediction along with a timestamp, keep last 20 queries
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...item
    };
    setHistory(prev => [newItem, ...prev].slice(0, 20));
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Prediction history cleared successfully.', 'success');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'detector':
        return (
          <Detector
            addHistoryItem={addHistoryItem}
            history={history}
            clearHistory={clearHistory}
            showToast={showToast}
          />
        );
      case 'batch':
        return <BatchScanner showToast={showToast} />;
      case 'radar':
        return <ScamRadar showToast={showToast} />;
      case 'about':
        return <About />;
      case 'status':
        return <ApiStatus showToast={showToast} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };


  return (
    <MainLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderPage()}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MainLayout>
  );
}
