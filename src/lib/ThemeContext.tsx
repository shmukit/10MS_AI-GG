import React, { createContext, useContext, useState, useEffect } from 'react';

export type NeutralPalette =
  | 'warm-stone'
  | 'charcoal-ivory'
  | 'cool-slate'
  | 'paper-white';

export const PALETTE_OPTIONS: { id: NeutralPalette; label: string; hint: string }[] = [
  { id: 'warm-stone', label: 'Warm Stone', hint: 'Stone canvas · zinc dark' },
  { id: 'charcoal-ivory', label: 'Charcoal + Ivory', hint: 'Warm grey · true charcoal' },
  { id: 'cool-slate', label: 'Cool Slate', hint: 'Blue-grey · navy dark' },
  { id: 'paper-white', label: 'Paper White', hint: 'Cream canvas · warm dark' },
];

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  palette: NeutralPalette;
  setPalette: (palette: NeutralPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const VALID_PALETTES = new Set<string>(PALETTE_OPTIONS.map((p) => p.id));

function readStoredPalette(): NeutralPalette {
  const saved = localStorage.getItem('palette');
  if (saved && VALID_PALETTES.has(saved)) return saved as NeutralPalette;
  return 'warm-stone';
}

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

  const [palette, setPaletteState] = useState<NeutralPalette>(readStoredPalette);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);
  }, [palette]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const setPalette = (next: NeutralPalette) => setPaletteState(next);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
