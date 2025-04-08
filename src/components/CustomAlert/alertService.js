// alertService.js
// Un servicio centralizado para gestionar las alertas en toda la aplicación

import React from 'react';
import ReactDOM from 'react-dom';
import CustomAlert from './CustomAlert';

// Crear un contenedor para las alertas si no existe
const getAlertContainer = () => {
  let container = document.getElementById('alert-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  
  return container;
};

// IDs únicos para las alertas
let nextAlertId = 1;

// Función para mostrar una alerta
const showAlert = (message, type = 'info', duration = 5000) => {
  const container = getAlertContainer();
  const alertId = nextAlertId++;
  
  // Crear un div para esta alerta específica
  const alertDiv = document.createElement('div');
  alertDiv.id = `alert-${alertId}`;
  container.appendChild(alertDiv);
  
  // Función para eliminar la alerta del DOM cuando se cierre
  const removeAlert = () => {
    ReactDOM.unmountComponentAtNode(alertDiv);
    alertDiv.remove();
  };
  
  // Renderizar el componente de alerta en el div
  ReactDOM.render(
    <CustomAlert 
      message={message}
      type={type}
      duration={duration}
      onClose={removeAlert}
    />,
    alertDiv
  );
  
  // Devolver el ID para poder cerrar manualmente la alerta si es necesario
  return alertId;
};

// Funciones específicas para diferentes tipos de alertas
const info = (message, duration = 5000) => showAlert(message, 'info', duration);
const success = (message, duration = 5000) => showAlert(message, 'success', duration);
const warning = (message, duration = 5000) => showAlert(message, 'warning', duration);
const error = (message, duration = 5000) => showAlert(message, 'error', duration);

// Función para cerrar todas las alertas
const closeAll = () => {
  const container = getAlertContainer();
  ReactDOM.unmountComponentAtNode(container);
  container.innerHTML = '';
};

// Exportar las funciones del servicio
const alertService = {
  showAlert,
  info,
  success,
  warning,
  error,
  closeAll
};

export default alertService;