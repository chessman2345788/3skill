import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Base layout structure for VeriWork.
 * Implements atmospheric background spotlights, cyber grid matrix, and obsidian framing.
 */
export default function MainLayout({ children, currentPage, setCurrentPage, theme, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 relative overflow-x-hidden selection:bg-cyan-500/25 selection:text-cyan-200">
      
      {/* Cyber Grid Background Matrix */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      
      {/* Top Ambient Laser Spotlights */}
      <div className="fixed top-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-200px] w-[600px] h-[600px] bg-indigo-600/5 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-cyan-600/5 blur-[160px] pointer-events-none z-0" />

      {/* Sticky Header Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Primary Viewport Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
