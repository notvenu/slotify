/**
 * Centralized modern color configuration (Refined UI/UX – 2025)
 */

export const colorConfig = {
  /* =========================
     SOCIAL / BRAND
  ========================== */
  brand: {
    github: {
      base: '#6B7280',
      hoverLight: '#333',
      hoverDark: '#fff',
    },
    linkedin: { base: '#6B7280', hover: '#0A66C2' },
    instagram: { base: '#6B7280', hover: '#E4405F' },
    gmail: { base: '#6B7280', hover: '#EA4335' },
  },

  /* =========================
     CORE PALETTE
  ========================== */
  primary: {
    light: '#4988C4',
    main: '#1C4D8D',
    dark: '#0F2854',
    extraLight: '#BDE8F5',
    extraDark: '#0A1A3A',
  },

  secondary: {
    light: '#BDE8F5',
    main: '#4988C4',
    dark: '#1C4D8D',
    extraLight: '#E6F7FB',
    extraDark: '#0F2854',
  },

  /* =========================
     SLOT TYPES
  ========================== */
  slotTypes: {
    theory: {
      light: 'bg-emerald-600 text-white',
      dark: 'bg-emerald-700 text-emerald-50',
    },
    lab: {
      light: 'bg-orange-500 text-white',
      dark: 'bg-orange-600 text-orange-50',
    },
    project: {
      light: 'bg-purple-500 text-white',
      dark: 'bg-purple-600 text-purple-50',
    },
  },

  /* =========================
     TIMETABLE GRID
  ========================== */
  timetable: {
    light: {
      header: {
        primary: 'border-slate-300 bg-slate-700 text-white',
        secondary: 'border-slate-300 bg-slate-600 text-white',
      },
      cell: {
        day: 'border-slate-300 bg-slate-100 text-slate-800',
        type: 'border-slate-300 bg-slate-50 text-slate-700',
        lunch: 'border-slate-300 bg-slate-100 text-slate-700',
        slot: 'border-slate-300 bg-white text-slate-800',
      },
      course: {
        theory: 'bg-emerald-600 text-white',
        lab: 'bg-orange-400 text-white',
      },
      slotName: {
        theory: 'text-emerald-700',
        lab: 'text-orange-500',
      },
    },
    dark: {
      header: {
        primary: 'border-slate-500 bg-slate-700 text-slate-100',
        secondary: 'border-slate-500 bg-slate-600 text-slate-200',
      },
      cell: {
        day: 'border-slate-500 bg-slate-800 text-slate-100',
        type: 'border-slate-500 bg-slate-700 text-slate-200',
        lunch: 'border-slate-500 bg-slate-700 text-slate-200',
        slot: 'border-slate-500 bg-slate-800 text-slate-200',
      },
      course: {
        theory: 'bg-emerald-600 text-emerald-50',
        lab: 'bg-orange-500 text-orange-50',
      },
      slotName: {
        theory: 'text-emerald-400',
        lab: 'text-orange-300',
      },
    },
  },

  /* =========================
     BACKGROUND
  ========================== */
  background: {
    light: {
      page: 'bg-white',
      card: 'bg-slate-50',
      secondary: 'bg-[#BDE8F5]/20',
    },
    dark: {
      page: 'bg-slate-900',
      card: 'bg-slate-900',
      secondary: 'bg-slate-700',
    },
  },

  /* =========================
     TEXT
  ========================== */
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

  /* =========================
     BORDERS
  ========================== */
  border: {
    light: 'border-slate-300',
    dark: 'border-slate-600',
  },

  /* =========================
     BUTTONS
  ========================== */
  button: {
    primary: {
      light:
        'bg-[#1C4D8D] hover:bg-[#0F2854] active:bg-[#0A1A3A] text-white font-medium',
      dark:
        'bg-[#4988C4] hover:bg-[#1C4D8D] active:bg-[#0F2854] text-white font-medium',
    },
    secondary: {
      light:
        'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 font-medium',
      dark:
        'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 font-medium',
    },
    danger: {
      light:
        'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium',
      dark:
        'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium',
    },
    warning: {
      light:
        'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-medium',
      dark:
        'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-medium',
    },
  },

  /* =========================
     NAVIGATION
  ========================== */
  nav: {
    light: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border-slate-200',
      text: 'text-slate-700',
      activeText: 'text-[#4988C4] font-semibold',
    },
    dark: {
      bg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border-slate-700',
      text: 'text-slate-200',
      activeText: 'text-[#4988C4] font-semibold',
    },
  },

  /* =========================
     LINKS
  ========================== */
  link: {
    light: 'text-[#1C4D8D] hover:text-[#0F2854]',
    dark: 'text-[#4988C4] hover:text-[#BDE8F5]',
  },

  /* =========================
     ALERTS
  ========================== */
  alert: {
    info: {
      light:
        'bg-[#BDE8F5]/20 border-[#4988C4] text-[#0F2854]',
      dark:
        'bg-[#0F2854]/30 border-[#4988C4] text-[#BDE8F5]',
    },
    success: {
      light:
        'bg-[#BDE8F5]/20 border-[#4988C4] text-[#0F2854]',
      dark:
        'bg-[#0F2854]/30 border-[#4988C4] text-[#BDE8F5]',
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

  /* =========================
     INPUTS
  ========================== */
  input: {
    light: {
      bg: 'bg-white',
      border: 'border-slate-300',
      text: 'text-slate-900',
      focus: 'focus:ring-[#4988C4] focus:border-[#4988C4]',
    },
    dark: {
      bg: 'bg-slate-700',
      border: 'border-slate-600',
      text: 'text-slate-100',
      focus: 'focus:ring-[#4988C4] focus:border-[#4988C4]',
    },
  },
};

/* =========================
   HELPERS
========================== */
export const getThemeColor = (theme, map) =>
  map[theme === 'dark' ? 'dark' : 'light'];

export const getSlotTypeColor = (slotType, theme = 'light') =>
  colorConfig.slotTypes[slotType]?.[theme] ??
  colorConfig.slotTypes.theory[theme];
