/**
 * EduNem Design Tokens (Universal React Native Theme System)
 * Derived from src/index.css for 100% pixel-perfect fidelity.
 */

export const lightTheme = {
  isDark: false,
  bgApp: '#f1f5f9',
  bgMobile: '#ffffff',
  bgRow: '#ffffff',
  bgRowHover: '#f8fafc',
  bgSheet: '#ffffff',
  
  textMain: '#0f172a',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  
  borderLight: '#e2e8f0',

  colorPrimary: '#2563eb',
  bgPrimary: '#eff6ff',
  borderPrimary: '#bfdbfe',

  colorOk: '#059669',
  bgOk: '#ecfdf5',
  borderOk: '#a7f3d0',

  colorWarn: '#d97706',
  bgWarn: '#fffbeb',
  borderWarn: '#fde68a',

  colorDanger: '#dc2626',
  bgDanger: '#fef2f2',
  borderDanger: '#fecaca',

  colorInfo: '#2563eb',
  bgInfo: '#eff6ff',
  borderInfo: '#bfdbfe',

  bgAdmin: '#0b0f19',
  bgCard: '#ffffff',
  cardBorder: '#e2e8f0',
  inputBackground: '#f8fafc',
  inputBorder: '#cbd5e1',
  inputText: '#0f172a',
  inputPlaceholder: '#94a3b8',

  shadowColor: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  isDark: true,
  bgApp: '#030712',
  bgMobile: '#0f172a',
  bgRow: '#0f172a',
  bgRowHover: '#1e293b',
  bgSheet: '#1e293b',

  textMain: '#f8fafc',
  textMuted: '#94a3b8',
  textLight: '#64748b',

  borderLight: '#1e293b',

  colorPrimary: '#60a5fa',
  bgPrimary: 'rgba(59, 130, 246, 0.12)',
  borderPrimary: 'rgba(59, 130, 246, 0.3)',

  colorOk: '#34d399',
  bgOk: 'rgba(16, 185, 129, 0.15)',
  borderOk: 'rgba(16, 185, 129, 0.3)',

  colorWarn: '#fbbf24',
  bgWarn: 'rgba(245, 158, 11, 0.15)',
  borderWarn: 'rgba(245, 158, 11, 0.3)',

  colorDanger: '#f87171',
  bgDanger: 'rgba(239, 68, 68, 0.15)',
  borderDanger: 'rgba(239, 68, 68, 0.3)',

  colorInfo: '#60a5fa',
  bgInfo: 'rgba(59, 130, 246, 0.15)',
  borderInfo: 'rgba(59, 130, 246, 0.3)',

  bgAdmin: '#0b0f19',
  bgCard: '#1e293b',
  cardBorder: '#334155',
  inputBackground: '#0f172a',
  inputBorder: '#334155',
  inputText: '#f8fafc',
  inputPlaceholder: '#64748b',

  shadowColor: 'rgba(0, 0, 0, 0.5)',
};

export const theme = {
  colors: {
    primary: lightTheme.colorPrimary,
    bgPrimary: lightTheme.bgPrimary,
    borderPrimary: lightTheme.borderPrimary,

    ok: lightTheme.colorOk,
    bgOk: lightTheme.bgOk,
    borderOk: lightTheme.borderOk,

    warn: lightTheme.colorWarn,
    bgWarn: lightTheme.bgWarn,
    borderWarn: lightTheme.borderWarn,

    danger: lightTheme.colorDanger,
    bgDanger: lightTheme.bgDanger,
    borderDanger: lightTheme.borderDanger,

    info: lightTheme.colorInfo,
    bgInfo: lightTheme.bgInfo,
    borderInfo: lightTheme.borderInfo,

    textMain: lightTheme.textMain,
    textMuted: lightTheme.textMuted,
    textLight: lightTheme.textLight,

    bgApp: lightTheme.bgApp,
    bgMobile: lightTheme.bgMobile,
    bgRow: lightTheme.bgRow,
    bgRowHover: lightTheme.bgRowHover,
    bgSheet: lightTheme.bgSheet,
    bgAdmin: lightTheme.bgAdmin,
    bgCard: lightTheme.bgCard,
    cardBorder: lightTheme.cardBorder,

    borderLight: lightTheme.borderLight,
    inputBackground: lightTheme.inputBackground,
    inputBorder: lightTheme.inputBorder,
    inputText: lightTheme.inputText,
    inputPlaceholder: lightTheme.inputPlaceholder,

    colorPrimary: lightTheme.colorPrimary,
    colorOk: lightTheme.colorOk,
    colorWarn: lightTheme.colorWarn,
    colorDanger: lightTheme.colorDanger,
    colorInfo: lightTheme.colorInfo,
  },
  ...lightTheme,
};

export default theme;

