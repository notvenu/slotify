import React from 'react';
import { colorConfig, getThemeColor } from '../utils/colors';

const TYPE_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export default function Toast({ message, type = 'info', visible, theme = 'light' }) {
  const alertClasses = getThemeColor(theme, colorConfig.alert[type] || colorConfig.alert.info) || '';
  const icon = TYPE_ICONS[type] || TYPE_ICONS.info;

  // derive parts from the combined alert classes
  const bgClass = (alertClasses.match(/bg-[^\s]+/g) || []).join(' ');
  const borderClass = (alertClasses.match(/border-[^\s]+/g) || []).join(' ');
  const textClass = (alertClasses.match(/text-[^\s]+/g) || []).join(' ');

  // icon background choices per type (stronger contrast)
  const iconBgMap = {
    info: theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600',
    success: theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600',
    warning: theme === 'dark' ? 'bg-amber-500' : 'bg-amber-600',
    error: theme === 'dark' ? 'bg-red-500' : 'bg-red-600',
  };
  const iconBg = iconBgMap[type] || iconBgMap.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${bgClass} ${borderClass} ${textClass} transition-all duration-500 ease-out transform ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
        }`}
      >
        <div className={`${iconBg} rounded-full w-9 h-9 flex items-center justify-center text-white shrink-0`}>{icon}</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
