import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Base layout structural framework for the application.
 * Adds dynamic dark/light glow background blobs to support the premium SaaS feel.
 */
export default function MainLayout({ children, currentPage, setCurrentPage, theme, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Sticky Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Primary Content Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col">
        {children}
      </main>

      {/* Global Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
