import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'zen' | 'night' | 'energy';

interface ThemeContextType {
   theme: Theme;
   setTheme: (theme: Theme) => void;
   backgroundGradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES = {
   zen: "bg-gradient-to-br from-teal-50 via-emerald-100 to-cyan-100",
   night: "bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white", // Night mode needs text-white globally often, but handle carefully
   energy: "bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100",
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [theme, setTheme] = useState<Theme>('zen');

   return (
      <ThemeContext.Provider value={{
         theme,
         setTheme,
         backgroundGradient: THEMES[theme]
      }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => {
   const context = useContext(ThemeContext);
   if (!context) throw new Error("useTheme must be used within ThemeProvider");
   return context;
};
