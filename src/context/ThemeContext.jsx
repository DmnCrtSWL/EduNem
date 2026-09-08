import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme, theme as defaultThemeToken } from '../theme/tokens';

const ThemeContext = createContext({
  theme: defaultThemeToken,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const activeTheme = isDark ? darkTheme : lightTheme;

  const themeObj = {
    colors: {
      primary: activeTheme.colorPrimary,
      bgPrimary: activeTheme.bgPrimary,
      borderPrimary: activeTheme.borderPrimary,

      ok: activeTheme.colorOk,
      bgOk: activeTheme.bgOk,
      borderOk: activeTheme.borderOk,

      warn: activeTheme.colorWarn,
      bgWarn: activeTheme.bgWarn,
      borderWarn: activeTheme.borderWarn,

      danger: activeTheme.colorDanger,
      bgDanger: activeTheme.bgDanger,
      borderDanger: activeTheme.borderDanger,

      info: activeTheme.colorInfo,
      bgInfo: activeTheme.bgInfo,
      borderInfo: activeTheme.borderInfo,

      textMain: activeTheme.textMain,
      textMuted: activeTheme.textMuted,
      textLight: activeTheme.textLight,

      bgApp: activeTheme.bgApp,
      bgMobile: activeTheme.bgMobile,
      bgRow: activeTheme.bgRow,
      bgRowHover: activeTheme.bgRowHover,
      bgSheet: activeTheme.bgSheet,
      bgAdmin: activeTheme.bgAdmin,
      bgCard: activeTheme.bgCard,
      cardBorder: activeTheme.cardBorder,

      borderLight: activeTheme.borderLight,
      inputBackground: activeTheme.inputBackground,
      inputBorder: activeTheme.inputBorder,
      inputText: activeTheme.inputText,
      inputPlaceholder: activeTheme.inputPlaceholder,

      colorPrimary: activeTheme.colorPrimary,
      colorOk: activeTheme.colorOk,
      colorWarn: activeTheme.colorWarn,
      colorDanger: activeTheme.colorDanger,
      colorInfo: activeTheme.colorInfo,
    },
    ...activeTheme,
  };

  return (
    <ThemeContext.Provider value={{ theme: themeObj, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

