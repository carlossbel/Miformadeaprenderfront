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
  const navigate = useNavigate();


  // Cargar las preguntas desde la API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://miformadeaprender-all.onrender.com/auth/preguntas', {
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
  };

  // Manejar el avance a la siguiente pregunta
  const goToNextQuestion = () => {
    if (isAnswered) {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Pasa a la siguiente pregunta
        setIsAnswered(false); // Reinicia el estado de respuesta
        setSelectedOption(null); // Resetea la opción seleccionada
      } else {
        // Si es la última pregunta, redirige a la página de resultados
        navigate('/resultado'); // Asegúrate de que la ruta '/resultado' exista en tu router
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
  

  return (
    <div className="kahoot-container">
      <div className="kahoot-box">
        <div className="question-container">
          <div className="kahoot-question">
            {currentQuestion.contenido} {/* Muestra la pregunta */}
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



        {isAnswered && (
  <div className="next-button-container">
  <button className="next-button" onClick={goToNextQuestion}>
    <div className="svg-wrapper-1">
      <div className="svg-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path
            fill="currentColor"
            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
          ></path>
        </svg>
      </div>
    </div>
    <span>Siguiente</span>
  </button>
</div>

)}

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
