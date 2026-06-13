import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/palettes.css';
import './styles/themes.css';
import { initPostHog } from './lib/posthog';

// Initialize PostHog
try {
  initPostHog();
} catch (error) {
  console.warn('PostHog initialization failed (likely blocked by client):', error);
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
