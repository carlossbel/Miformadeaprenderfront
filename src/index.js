import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router'; // Cambia App por AppRouter para manejar las rutas jjjjjjjjj
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppRouter />,  
  document.getElementById('root')
);

reportWebVitals();
