import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/motion/ScrollProgress';
import CustomCursor from '../components/motion/CustomCursor';
import AmbientBackground from '../components/motion/AmbientBackground';

/**
 * Base layout structure for VeriWork.
 * Implements living ambient physics, cursor tracking, scroll progress bar, and floating navigation.
 */
export default function MainLayout({ children, currentPage, setCurrentPage, theme, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 relative overflow-x-hidden selection:bg-cyan-500/25 selection:text-cyan-200">
      
      {/* Viewport Laser Scroll Progress */}
      <ScrollProgress />

      {/* Desktop Custom Ambient Cursor */}
      <CustomCursor />

      {/* Living Ambient Background Layer */}
      <AmbientBackground />

      {/* Sticky Floating Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Viewport Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
