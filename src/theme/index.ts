import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { KEYS, getItem, setItem } from '@utils/storage';

export const gradients = {
  primary: ['#6366F1', '#7C3AED'] as const,
  primarySoft: ['#EEF2FF', '#F3E8FF'] as const,
  brandMark: ['#7C3AED', '#6366F1'] as const,
};

export const lightColors = {
  primary: '#6366F1',
  primaryEnd: '#7C3AED',
  primaryLight: '#EEF2FF',
  primaryDark: '#4F46E5',

  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  link: '#6366F1',

  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  border: '#E5E7EB',
  divider: '#E5E7EB',
  shadow: 'rgba(99, 102, 241, 0.12)',
  inputBackground: '#FFFFFF',
  chipInactive: '#F1F5F9',
  navBackground: '#FFFFFF',
} as const;

export const colors = lightColors;

export const darkColors = {
  primary: '#6366F1',
  primaryEnd: '#818CF8',
  primaryLight: '#2A2D45',
  primaryDark: '#4F46E5',

  background: '#0B0E14',
  surface: '#1A1D26',
  surfaceAlt: '#232733',

  textPrimary: '#FFFFFF',
  textSecondary: '#8B93A7',
  textDisabled: '#5C6478',
  link: '#818CF8',

  success: '#22C55E',
  successLight: '#14532D',
  warning: '#F59E0B',
  warningLight: '#422006',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  info: '#3B82F6',
  infoLight: '#1E3A5F',

  border: '#2A2F3D',
  divider: '#232733',
  shadow: 'rgba(99, 102, 241, 0.25)',
  inputBackground: '#1A1D26',
  chipInactive: '#232733',
  navBackground: '#11141C',
} as const;

export type ColorScheme = {
  [K in keyof typeof lightColors]: string;
};

export const fonts = {
  display: 'Inter_700Bold',
  heading: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  label: 'Inter_500Medium',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

const lightShadows = {
  card: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  social: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;

const darkShadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  social: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export type Shadows = {
  readonly card: {
    readonly shadowColor: string;
    readonly shadowOffset: { readonly width: number; readonly height: number };
    readonly shadowOpacity: number;
    readonly shadowRadius: number;
    readonly elevation: number;
  };
  readonly button: {
    readonly shadowColor: string;
    readonly shadowOffset: { readonly width: number; readonly height: number };
    readonly shadowOpacity: number;
    readonly shadowRadius: number;
    readonly elevation: number;
  };
  readonly modal: {
    readonly shadowColor: string;
    readonly shadowOffset: { readonly width: number; readonly height: number };
    readonly shadowOpacity: number;
    readonly shadowRadius: number;
    readonly elevation: number;
  };
  readonly social: {
    readonly shadowColor: string;
    readonly shadowOffset: { readonly width: number; readonly height: number };
    readonly shadowOpacity: number;
    readonly shadowRadius: number;
    readonly elevation: number;
  };
};

export type ThemeMode = 'light' | 'dark';

export type Theme = {
  colors: ColorScheme;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: Shadows;
  gradients: typeof gradients;
  mode: ThemeMode;
  isDark: boolean;
};

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function buildTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    fonts,
    spacing,
    radius,
    shadows: isDark ? darkShadows : lightShadows,
    gradients,
    mode,
    isDark,
  };
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getItem<ThemeMode>(KEYS.THEME_PREF).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setModeState(saved);
      } else if (systemScheme === 'dark') {
        setModeState('dark');
      }
      setIsReady(true);
    });
  }, [systemScheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setItem(KEYS.THEME_PREF, next).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: buildTheme(mode),
      mode,
      isDark: mode === 'dark',
      toggleTheme,
      setMode,
    }),
    [mode, toggleTheme, setMode],
  );

  if (!isReady) {
    return React.createElement(
      ThemeContext.Provider,
      {
        value: {
          theme: buildTheme('light'),
          mode: 'light',
          isDark: false,
          toggleTheme: () => {},
          setMode: () => {},
        },
      },
      children,
    );
  }

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return buildTheme('light');
  }
  return ctx.theme;
};

export const useThemeMode = (): Pick<ThemeContextValue, 'mode' | 'isDark' | 'toggleTheme' | 'setMode'> => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      mode: 'light',
      isDark: false,
      toggleTheme: () => {},
      setMode: () => {},
    };
  }
  return {
    mode: ctx.mode,
    isDark: ctx.isDark,
    toggleTheme: ctx.toggleTheme,
    setMode: ctx.setMode,
  };
};
