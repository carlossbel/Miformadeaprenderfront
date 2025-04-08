import React, { useState, useEffect } from 'react';
import './KahootForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import alertService from './alertService';

const KahootForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [visualPoints, setVisualPoints] = useState(0);
  const [auditivoPoints, setAuditivoPoints] = useState(0);
  const [kinestesicoPoints, setKinestesicoPoints] = useState(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const respuestaValores = {
    "Sí": 2,
    "No": 0,
    "A veces": 1
  };

  // URL de API con respaldo
  const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';

  // Verificar si existe un ID de usuario
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alertService.error('No se ha identificado un usuario. Redirigiendo al inicio.');
      setTimeout(() => navigate('/'), 2000);
    } else {
      alertService.info('Cargando cuestionario...');
    }
  }, [navigate]);

  // Cargar las preguntas desde la API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/auth/preguntas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data && data.length > 0) {
          setQuestions(data);
          alertService.success(`${data.length} preguntas cargadas correctamente`);
        } else {
          setError('No se encontraron preguntas');
          alertService.warning('No se encontraron preguntas');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener preguntas:', error);
        setError('Error al cargar las preguntas. Por favor, intenta nuevamente.');
        alertService.error('Error al cargar las preguntas');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [API_URL]);

  const handleOptionClick = (option) => {
    if (isSubmitting) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    // Obtener el estilo asociado a la pregunta
    const currentQuestion = questions[currentQuestionIndex];
    const questionStyle = currentQuestion.estilo;

    const respuestaValor = respuestaValores[option];

    // Acumular los puntos según el estilo
    if (questionStyle === 'visual') {
      setVisualPoints(prev => prev + respuestaValor);
    } else if (questionStyle === 'auditivo') {
      setAuditivoPoints(prev => prev + respuestaValor);
    } else if (questionStyle === 'kinestesico') {
      setKinestesicoPoints(prev => prev + respuestaValor);
    }

    // Enviar la respuesta
    sendAnswerToAPI(currentQuestion.pregunta_id, option, questionStyle, respuestaValor);
  };

  const sendAnswerToAPI = async (pregunta_id, respuesta, estilo, respuestaValor) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alertService.error('ID de usuario no encontrado');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/guardarRespuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: userId,
          pregunta_id,
          respuesta,
          estilo,
          respuestaValor,
          visualPoints,
          auditivoPoints,
          kinestesicoPoints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al guardar la respuesta:', errorData);
        alertService.error('Error al guardar la respuesta');
      } else {
        console.log('Respuesta guardada correctamente');
        // Si estamos en la última pregunta, mostramos un mensaje especial
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        if (isLastQuestion) {
          alertService.success('¡Última pregunta completada!');
        } else {
          alertService.success('Respuesta guardada');
        }
      }
    } catch (error) {
      console.error('Error al guardar la respuesta:', error);
      alertService.error('Error al guardar la respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (isNaN(visualPoints) || isNaN(auditivoPoints) || isNaN(kinestesicoPoints)) {
      alertService.error('Los puntos deben ser números válidos');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alertService.error('ID de usuario no encontrado');
      return;
    }

    setIsSubmitting(true);
    alertService.info('Procesando resultados finales...');

    try {
      const response = await fetch(`${API_URL}/auth/puntos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: userId,
          visual: visualPoints,
          auditivo: auditivoPoints,
          kinestesico: kinestesicoPoints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al actualizar los puntos:', errorData);
        alertService.error('Error al procesar los resultados');
        setIsSubmitting(false);
        return;
      }

      console.log('Puntos actualizados correctamente');
      alertService.success('¡Cuestionario completado exitosamente!');
      
      setTimeout(() => {
        setShouldNavigate(true);
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar los puntos:', error);
      alertService.error('Error al procesar los resultados');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/resultado');
    }
  }, [shouldNavigate, navigate]);

  // Manejar el avance a la siguiente pregunta
  const goToNextQuestion = () => {
    if (isSubmitting) return;
    
    if (selectedOption) {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        alertService.info(`Pregunta ${currentQuestionIndex + 2} de ${questions.length}`);
      } else {
        handleFinalSubmit();
      }
    } else {
      alertService.warning('Por favor, selecciona una respuesta');
    }
  };

  // Si está cargando, mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="loader">
        <span className="loader-text">Cargando cuestionario...</span>
        <span className="load"></span>
        <div className="stars-container">
          {Array.from({ length: 50 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className="star-icon"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${0.5 + Math.random() * 1.5}rem`,
                opacity: 0.1 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
        <div className="stars-container">
          {Array.from({ length: 50 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className="star-icon"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${0.5 + Math.random() * 1.5}rem`,
                opacity: 0.1 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Si no hay preguntas, mostrar mensaje
  if (questions.length === 0) {
    return (
      <div className="empty-container">
        <h2>No hay preguntas disponibles</h2>
        <p>Por favor, contacta al administrador.</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
        <div className="stars-container">
          {Array.from({ length: 50 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className="star-icon"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${0.5 + Math.random() * 1.5}rem`,
                opacity: 0.1 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="kahoot-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="question-counter">
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </div>
      
      <div className="kahoot-box">
        <div className="question-container">
          <div className="kahoot-question">
            {currentQuestion.contenido}
          </div>
        </div>

        <div className="options-container">
          {currentQuestion.opciones.map((option, index) => (
            <button
              key={index}
              className={`kahoot-option ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              disabled={isSubmitting}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="next-button-container">
          <button
            className="next-button"
            onClick={goToNextQuestion}
            disabled={!selectedOption || isSubmitting}
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </div>
            </div>
            <span>{currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
          </button>
        </div>
      </div>

      <div className="stars-container">
        {Array.from({ length: 50 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className="star-icon"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${0.5 + Math.random() * 1.5}rem`,
              opacity: 0.1 + Math.random() * 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default KahootForm;