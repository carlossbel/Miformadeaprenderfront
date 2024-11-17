import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './login'; 
import Cuestionario from './cuestionario';
import Datos from './datos';
import Registro from './registro';
import Tutor from './tutor';
import Profesor from './profesor';


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/login" element={<Login/>} /> 
        <Route path="/cuestionario" element={<Cuestionario/>} /> 
        <Route path="/datos" element={<Datos/>} /> 
        <Route path="/registro" element={<Registro/>} /> 
        <Route path="/tutor" element={<Tutor/>} />
        <Route path="/profesor" element={<Profesor/>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
