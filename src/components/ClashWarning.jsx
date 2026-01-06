import React from 'react'
import { colorConfig, getThemeColor } from '../utils/colors';

export default function ClashWarning({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const clashColor = getThemeColor(theme, colorConfig.alert.error);
  
  return (
    <div className={`border px-4 py-3 rounded-lg my-4 ${clashColor}`}>
      ⚠️ Slot Clash Detected! Please review your selections.
    </div>
  )
}