import React from 'react';
import './KahootForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const KahootForm = () => {
  const handleOptionClick = (option) => {
    console.log(`Opción seleccionada: ${option}`);
  };

  return (
    <div className="kahoot-container">
      <div className="kahoot-box">
        <div className="question-container">
          <div className="kahoot-question">
          ¿En qué situación te sientes más cómodo aprendiendo nuevos conceptos?
          </div>
        </div>

        
        <div className="options-container">
          <button className="kahoot-option" onClick={() => handleOptionClick('A')}>A) En una discusión grupal, donde puedo escuchar diferentes opiniones y hacer preguntas.</button>
          <button className="kahoot-option" onClick={() => handleOptionClick('B')}>B) Leyendo libros o artículos, donde puedo tomar notas y reflexionar sobre la información.</button>
          <button className="kahoot-option" onClick={() => handleOptionClick('C')}>C) Realizando actividades prácticas, donde puedo aplicar lo que he aprendido de inmediato.</button>
          <button className="kahoot-option" onClick={() => handleOptionClick('C')}>C) Mirando videos o tutoriales, donde puedo ver ejemplos visuales y seguir instrucciones paso a paso.</button>
          
        </div>
      </div>

      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-1" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-2" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-3" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-4" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-5" />
      </div>
    </div>
  );
};

export default KahootForm;
