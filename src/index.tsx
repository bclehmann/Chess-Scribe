import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@emotion/react';
import theme from './theme.ts';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme>
        <App />
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>
);

