import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/anton/400.css';
import '@fontsource/syne/500.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/form.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
