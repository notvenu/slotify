import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Centralized color variables using getThemeColor
  const navTheme = getThemeColor(theme, colorConfig.nav);
  const navBgClass = navTheme.bg;
  const navBorderClass = navTheme.border;
  const navActiveBgClass = navTheme.activeBg;
  const navActiveTextClass = navTheme.activeText;
  const navHoverBgClass = navTheme.hoverBg;
  const navTextClass = navTheme.text;
  const linkColorClass = getThemeColor(theme, colorConfig.link);
  const themeToggleBgClass = colorConfig.button.secondary[theme === 'dark' ? 'dark' : 'light'];
  const mobileMenuBgClass = colorConfig.button.secondary[theme === 'dark' ? 'dark' : 'light'];

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/course-selector', label: 'Course Selector' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${navBgClass} ${navBorderClass} backdrop-blur-sm`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/"
            className={`text-2xl font-bold transition-colors ${linkColorClass}`}
          >
            SLOTIFY
          </Link>

          {/* Navigation Items */}
          <div className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? navActiveTextClass
                    : navTextClass
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-lg transition-colors ${themeToggleBgClass}`}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className={`p-2 rounded-lg transition-colors ${mobileMenuBgClass}`}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${themeToggleBgClass}`}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className={`sm:hidden border-t transition-colors duration-300 ${navBorderClass}`}>
          <div className="px-2 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? `${navActiveBgClass} ${navActiveTextClass}`
                    : `${navTextClass} ${navHoverBgClass}`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}