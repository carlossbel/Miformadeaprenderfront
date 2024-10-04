import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './login'; 
import Cuestionario from './cuestionario';


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/login" element={<Login/>} /> 
        <Route path="/cuestionario" element={<Cuestionario/>} /> 
      </Routes>
    </Router>
  );
}

export default AppRouter;
