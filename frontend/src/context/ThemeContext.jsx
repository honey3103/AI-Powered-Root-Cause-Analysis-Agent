import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Lock theme permanently to dark (static black Coroot aesthetic)
  const theme = 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    localStorage.setItem('rca_theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Static dark theme - no-op or inform user
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
