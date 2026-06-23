import React, { createContext, useContext } from 'react';

export const colors = {
  primary: '#5B4FE9',
  primaryLight: '#EAE8FD',
  primaryDark: '#3D33C4',

  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F1F7',

  textPrimary: '#16172B',
  textSecondary: '#6B6E8A',
  textDisabled: '#B0B3C6',

  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  border: '#E4E5EF',
  divider: '#ECEDF5',
  shadow: 'rgba(91, 79, 233, 0.12)',
} as const;

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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#5B4FE9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const theme = {
  colors,
  fonts,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
};

export const useTheme = (): Theme => useContext(ThemeContext);
