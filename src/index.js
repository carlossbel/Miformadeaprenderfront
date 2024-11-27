// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router';
import reportWebVitals from './reportWebVitals';

// Elimina el ID del usuario del localStorage al iniciar
localStorage.removeItem('userId');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();
