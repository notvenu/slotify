import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);

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
    //{ path: '/faculty-ranker', label: 'Faculty Ranker' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const githubRepoUrl = 'https://github.com/notvenu/slotify';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${navBgClass} ${navBorderClass} backdrop-blur-sm`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/"
            className={`text-2xl font-bold transition-colors ${linkColorClass}`}
          >
            SLOTIFY
          </Link>

          <div className="hidden sm:flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? navActiveTextClass
                    : navTextClass
                }`}
              >
                {item.label}
              </Link>
            ))}

            <a
              href={`${githubRepoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${themeToggleBgClass}`}
              aria-label="Star on GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Star
            </a>

            <button
              onClick={toggleTheme}
              className={`ml-2 px-3 py-2 rounded-lg transition-colors ${themeToggleBgClass}`}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </div>

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
            <a
              href={`${githubRepoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${themeToggleBgClass}`}
              aria-label="Star on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
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
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? navActiveTextClass
                    : navTextClass
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