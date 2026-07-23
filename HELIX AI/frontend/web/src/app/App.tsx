import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EmotionProvider } from '../context/EmotionContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppRoutes } from './routes';

const ThemedApp = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-1000 animate-gradient">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <EmotionProvider>
        <ThemedApp />
      </EmotionProvider>
    </ThemeProvider>
  );
}

export default App;