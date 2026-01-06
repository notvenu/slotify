/**
 * Centralized modern color configuration (Fresh UI/UX – 2025)
 */

export const colorConfig = {
  // Primary Brand – Vibrant Emerald Green
  primary: {
    light: '#059669',     // emerald-600
    main: '#10B981',      // emerald-500
    dark: '#047857',      // emerald-700
    extraLight: '#A7F3D0',// emerald-200
    extraDark: '#064E3B', // emerald-900
  },

  // Secondary – Vibrant Blue
  secondary: {
    light: '#0EA5E9',     // sky-500
    main: '#0284C7',      // sky-600
    dark: '#0369A1',      // sky-700
    extraLight: '#BAE6FD',// sky-200
    extraDark: '#082F49', // sky-950
  },

  // Slot Type Colors (vibrant and distinct)
  slotTypes: {
    theory: {
      light: {
        bg: 'bg-emerald-500',
        text: 'text-white',
        class: 'bg-emerald-500 text-white',
      },
      dark: {
        bg: 'bg-emerald-600',
        text: 'text-emerald-50',
        class: 'bg-emerald-600 text-emerald-50',
      },
    },
    lab: {
      light: {
        bg: 'bg-blue-500',
        text: 'text-white',
        class: 'bg-blue-500 text-white',
      },
      dark: {
        bg: 'bg-blue-600',
        text: 'text-blue-50',
        class: 'bg-blue-600 text-blue-50',
      },
    },
    project: {
      light: {
        bg: 'bg-purple-500',
        text: 'text-white',
        class: 'bg-purple-500 text-white',
      },
      dark: {
        bg: 'bg-purple-600',
        text: 'text-purple-50',
        class: 'bg-purple-600 text-purple-50',
      },
    },
  },

  // Backgrounds – vibrant yet sophisticated
  background: {
    light: {
      page: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
      card: 'bg-white',
      secondary: 'bg-slate-50',
    },
    dark: {
      page: 'bg-gradient-to-br from-slate-900 to-slate-800',
      card: 'bg-slate-800',
      secondary: 'bg-slate-700',
    },
  },

  // Text Colors – high contrast
  text: {
    light: {
      primary: 'text-slate-900',
      secondary: 'text-slate-700',
      muted: 'text-slate-600',
    },
    dark: {
      primary: 'text-slate-50',
      secondary: 'text-slate-200',
      muted: 'text-slate-400',
    },
  },

  // Borders
  border: {
    light: 'border-slate-300',
    dark: 'border-slate-600',
  },

  // Buttons – bold and interactive
  button: {
    primary: {
      light: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-medium',
      dark: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium',
    },
    secondary: {
      light: 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 font-medium',
      dark: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 font-medium',
    },
    danger: {
      light: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium',
      dark: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium',
    },
    warning: {
      light: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-medium',
      dark: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-medium',
    },
  },

  // Navigation – modern and clean
  nav: {
    light: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border-slate-200',
      activeBg: 'bg-emerald-50',
      activeText: 'text-emerald-600',
      hoverBg: 'bg-slate-100',
      text: 'text-slate-700',
    },
    dark: {
      bg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border-slate-700',
      activeBg: 'bg-slate-700',
      activeText: 'text-emerald-400',
      hoverBg: 'bg-slate-700/50',
      text: 'text-slate-200',
    },
  },

  // Links
  link: {
    light: 'text-emerald-600 hover:text-emerald-700',
    dark: 'text-emerald-400 hover:text-emerald-300',
  },

  // Alerts – vibrant and clear
  alert: {
    info: {
      light: 'bg-blue-50 border-blue-300 text-blue-900',
      dark: 'bg-blue-900/30 border-blue-600 text-blue-200',
    },
    success: {
      light: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      dark: 'bg-emerald-900/30 border-emerald-600 text-emerald-200',
    },
    warning: {
      light: 'bg-amber-50 border-amber-300 text-amber-900',
      dark: 'bg-amber-900/30 border-amber-600 text-amber-200',
    },
    error: {
      light: 'bg-red-50 border-red-300 text-red-900',
      dark: 'bg-red-900/30 border-red-600 text-red-200',
    },
  },

  // Inputs – clean and modern
  input: {
    light: {
      bg: 'bg-white',
      border: 'border-slate-300',
      text: 'text-slate-900',
      focus: 'focus:ring-emerald-500 focus:border-emerald-500',
    },
    dark: {
      bg: 'bg-slate-700',
      border: 'border-slate-600',
      text: 'text-slate-100',
      focus: 'focus:ring-emerald-500 focus:border-emerald-500',
    },
  },
};

/* Helpers remain unchanged */
export const getThemeColor = (theme, colorMap) =>
  colorMap[theme === 'dark' ? 'dark' : 'light'];

export const getSlotTypeColor = (slotType, theme = 'light') => {
  const slot = colorConfig.slotTypes[slotType];
  if (!slot) return colorConfig.slotTypes.theory[theme];
  return slot[theme === 'dark' ? 'dark' : 'light'].class;
};
