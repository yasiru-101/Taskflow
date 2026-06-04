/**
 * @file main.jsx
 * @description Application entry point. Mounts the root React component (App.jsx) into the DOM root element.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
