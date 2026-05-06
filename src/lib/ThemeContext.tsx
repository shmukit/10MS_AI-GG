import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'default' | 'cherryblossoms' | 'shroomhaze' | 'flare';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
