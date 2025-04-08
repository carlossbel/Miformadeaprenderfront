import React, { useState, useEffect } from 'react';
import './CustomAlert.css';

const CustomAlert = ({ 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  duration = 5000, // Duración en milisegundos
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  // Configurar un temporizador para cerrar automáticamente la alerta
  useEffect(() => {
    if (!duration) return;
    
    // Actualizar la barra de progreso cada 10ms
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (duration / 10));
      });
    }, 10);
    
    // Cerrar la alerta cuando el tiempo expire
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    // Limpiar temporizadores
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration]);
  
  // Cerrar la alerta
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Dar tiempo para la animación
  };
  
  // Si no es visible, no renderizar nada
  if (!isVisible) return null;
  
  // Determinar icono basado en el tipo
  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '✕';
      default: return 'ℹ️';
    }
  };
  
  return (
    <div className={`custom-alert custom-alert-${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="custom-alert-icon">{getIcon()}</div>
      <div className="custom-alert-content">{message}</div>
      <button className="custom-alert-close" onClick={handleClose}>×</button>
      <div 
        className="custom-alert-progress" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};

export default CustomAlert;