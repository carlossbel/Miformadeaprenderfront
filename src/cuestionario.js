import React, { useState, useEffect } from 'react';
import './KahootForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const KahootForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Comienza en la primera pregunta
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [visualPoints, setVisualPoints] = useState(0); // Puntos acumulados para visual
  const [auditivoPoints, setAuditivoPoints] = useState(0); // Puntos acumulados para auditivo
  const [kinestesicoPoints, setKinestesicoPoints] = useState(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const navigate = useNavigate();
  const respuestaValores = {
    "Sí": 2,
    "No": 0,
    "A veces": 1
  };

  // Cargar las preguntas desde la API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/preguntas`, {
          method: 'GET',  // Especificamos que la solicitud es un GET
          headers: {
            'Content-Type': 'application/json',  // Aseguramos que el contenido sea JSON
          }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data); // Verifica los datos que recibes de la API

        if (data && data.length > 0) {
          setQuestions(data); // Guardar las preguntas en el estado
        } else {
          console.error('No se encontraron preguntas');
        }
      } catch (error) {
        console.error('Error al obtener preguntas:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAnswered(true); // Marca la pregunta como respondida

    // Aquí se obtiene el estilo asociado a la pregunta (visual, auditivo, kinestésico)
    const currentQuestion = questions[currentQuestionIndex];
    const questionStyle = currentQuestion.estilo; // Suponiendo que cada pregunta tiene un campo 'estilo'

    const respuestaValor = respuestaValores[option];

    // Acumular los puntos según el estilo de la pregunta
    if (questionStyle === 'visual') {
      setVisualPoints(prev => prev + respuestaValor);
    } else if (questionStyle === 'auditivo') {
      setAuditivoPoints(prev => prev + respuestaValor);
    } else if (questionStyle === 'kinestesico') {
      setKinestesicoPoints(prev => prev + respuestaValor);
    }

    // Enviar la respuesta y los puntos acumulados a la API
    sendAnswerToAPI(currentQuestion.pregunta_id, option, questionStyle, respuestaValor);
  };

  const sendAnswerToAPI = async (pregunta_id, respuesta, estilo, respuestaValor) => {
    const userId = localStorage.getItem('userId'); // Recupera el ID del usuario desde el localStorage

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/guardarRespuesta`, {
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
        console.error('Error al guardar la respuesta:', await response.json());
      }
    } catch (error) {
      console.error('Error al guardar la respuesta:', error);
    }
  };

  const handleFinalSubmit = async () => {
    if (isNaN(visualPoints) || isNaN(auditivoPoints) || isNaN(kinestesicoPoints)) {
      console.error('Los puntos deben ser números válidos');
      return;
    }

    const userId = localStorage.getItem('userId'); // Recupera el ID del usuario desde el localStorage
    console.log('Visual:', visualPoints, 'Auditivo:', auditivoPoints, 'Kinestésico:', kinestesicoPoints);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/puntos`, {
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
        return;
      }

      console.log('Puntos actualizados correctamente');
      setShouldNavigate(true);
    } catch (error) {
      console.error('Error al actualizar los puntos:', error);
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/resultado'); // Redirige solo cuando `shouldNavigate` sea true
    }
  }, [shouldNavigate, navigate]);

  //Acceder al id
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró el ID del usuario.');
      navigate('/'); // Redirige al inicio si no hay ID
    }
    console.log('Usuario actual con ID:', userId);
  }, []);

  // Manejar el avance a la siguiente pregunta
  const goToNextQuestion = () => {
    if (selectedOption) { // Solo avanzar si se ha seleccionado una respuesta
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedOption(null);
      } else {
        handleFinalSubmit();
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="loader">
        <span className="loader-text">Cargando..</span>
        <span className="load"></span>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Comprobamos si la pregunta actual existe
  if (!currentQuestion) {
    return <div>¡Gracias por responder todas las preguntas!</div>; // Si no hay más preguntas, muestra el mensaje final
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="kahoot-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="kahoot-box">
        <div className="question-container">
          <div className="kahoot-question">
            {currentQuestion.contenido} {}
          </div>
        </div>

        <div className="options-container">
          {currentQuestion.opciones.map((option, index) => (
            <button
              key={index}
              className={`kahoot-option ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {}
        <div className="next-button-container">
          <button
            className="next-button"
            onClick={goToNextQuestion}
            disabled={!selectedOption} // El botón solo está habilitado si se seleccionó una opción
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </div>
            </div>
            <span>Siguiente</span>
          </button>
        </div>
      </div>

      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-12" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-23" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-34" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-45" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-56" />
      </div>
    </div>
  );
};

export default KahootForm;
