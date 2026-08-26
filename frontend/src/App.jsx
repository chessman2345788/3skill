import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Detector from './pages/Detector';
import BatchScanner from './pages/BatchScanner';
import ScamRadar from './pages/ScamRadar';
import About from './pages/About';
import ApiStatus from './pages/ApiStatus';
import Toast from './components/Toast';
import PageTransition from './components/motion/PageTransition';

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

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

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
    return (
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <PageTransition routeKey="home">
            <Home setCurrentPage={setCurrentPage} />
          </PageTransition>
        )}
        {currentPage === 'detector' && (
          <PageTransition routeKey="detector">
            <Detector
              addHistoryItem={addHistoryItem}
              history={history}
              clearHistory={clearHistory}
              showToast={showToast}
            />
          </PageTransition>
        )}
        {currentPage === 'batch' && (
          <PageTransition routeKey="batch">
            <BatchScanner showToast={showToast} />
          </PageTransition>
        )}
        {currentPage === 'radar' && (
          <PageTransition routeKey="radar">
            <ScamRadar showToast={showToast} />
          </PageTransition>
        )}
        {currentPage === 'about' && (
          <PageTransition routeKey="about">
            <About />
          </PageTransition>
        )}
        {currentPage === 'status' && (
          <PageTransition routeKey="status">
            <ApiStatus showToast={showToast} />
          </PageTransition>
        )}
      </AnimatePresence>
    );
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
