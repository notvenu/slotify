import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseScheduler from './pages/CourseScheduler';
import FacultyRanker from './pages/FacultyRanker';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppContent() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        if (saved === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        // Use system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        setTheme(systemTheme);
        if (systemTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', systemTheme);
      }
    } catch (e) {
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const fallbackTheme = prefersDark ? 'dark' : 'light';
      setTheme(fallbackTheme);
      if (fallbackTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, []);

  const shouldShowNavbar = location.pathname !== '/';

  return (
    <>
      <Analytics />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage theme={theme} />}
            />
            <Route 
              path="/course-selector" 
              element={<CourseScheduler theme={theme} />}
            />
            <Route 
              path="/faculty-ranker" 
              element={<FacultyRanker theme={theme} />}
            />
            <Route 
              path="/contact" 
              element={<Contact theme={theme} />}
            />
          </Routes>
        </main>
        <Footer theme={theme} />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;