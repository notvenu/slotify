import React from 'react';
import { colorConfig, getThemeColor } from '../utils/colors';


export default function Toast({ message, type = 'info', visible, theme = 'light' }) {
  const isDark = theme === 'dark';
  
  // Theme-specific toast styling using exact palette colors
  const toastStyles = {
    info: {
      light: `bg-white border-2 border-[#4988C4] text-[#0F2854] shadow-xl`,
      dark: `bg-[#0F2854] border-2 border-[#4988C4] text-[#BDE8F5] shadow-xl`,
    },
    success: {
      light: `bg-white border-2 border-[#1C4D8D] text-[#0F2854] shadow-xl`,
      dark: `bg-[#1C4D8D] border-2 border-[#4988C4] text-white shadow-xl`,
    },
    warning: {
      light: `bg-white border-2 border-amber-500 text-amber-900 shadow-xl`,
      dark: `bg-amber-900 border-2 border-amber-500 text-amber-100 shadow-xl`,
    },
    error: {
      light: `bg-white border-2 border-red-500 text-red-900 shadow-xl`,
      dark: `bg-red-900 border-2 border-red-500 text-red-100 shadow-xl`,
    },
  };

  const toastClass = toastStyles[type]?.[isDark ? 'dark' : 'light'] || toastStyles.info[isDark ? 'dark' : 'light'];

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto px-4 py-3 rounded-xl flex items-center gap-3 max-w-sm ${toastClass} transition-all duration-500 ease-out transform ${
          visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-24 scale-95'
        }`}
      >
        <div className="text-sm font-medium">{message}</div>
      </div>
    </div>
  );
}
