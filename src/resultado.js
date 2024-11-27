import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './resultado.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Resultado = () => {
    const navigate = useNavigate();
    const [resultados, setResultados] = useState([]);
    const [progress, setProgress] = useState([0, 0, 0]);

    const [userId, setUserId] = useState(null);

    // Obtener el userId de localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            console.error('No se encontró el ID del usuario.');
            navigate('/'); // Redirige al inicio si no hay ID
        } else {
            setUserId(storedUserId);
            console.log('Usuario actual con ID:', storedUserId);
        }
    }, [navigate]);

    // Obtener los resultados desde la API cuando el userId esté disponible
    useEffect(() => {
        if (userId) {
            const fetchResultados = async () => {
                try {
                    const response = await fetch(`https://miformadeaprender-all.onrender.com/auth/getpuntos/${userId}`);
                    
                    const data = await response.json();

                    if (response.status !== 200) {
                        console.error(data.error);
                    } else {
                        setResultados([
                            { estilo: "Visual", porcentaje: parseFloat(data.visual) },
                            { estilo: "Auditivo", porcentaje: parseFloat(data.auditivo) },
                            { estilo: "Kinestésico", porcentaje: parseFloat(data.kinestesico) },
                        ]);
                    }
                } catch (error) {
                    console.error('Error al obtener los resultados:', error);
                }
            };

            fetchResultados();
        }
    }, [userId]);

    useEffect(() => {
        const intervalIds = resultados.map((resultado, index) => {
            return setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = [...prevProgress];
                    if (newProgress[index] < resultado.porcentaje) {
                        newProgress[index] += 1;
                    } else {
                        clearInterval(intervalIds[index]);
                    }
                    return newProgress;
                });
            }, 1);
        });

        return () => intervalIds.forEach((id) => clearInterval(id));
    }, [resultados]);

    const handleBackClick = () => {
        navigate('/'); 
    };

    const pMin = resultados.length > 0 
    ? resultados.reduce((min, item) =>
        item.porcentaje < min.porcentaje ? item : min
      )
    : null;

    let x;
    useEffect(() => {
        if (pMin && pMin.estilo) {
            switch (pMin.estilo) {
                case 'Kinestésico':
                    navigate('/kinestesico');
                    break;
                case 'Auditivo':
                    navigate('/auditivo');
                    break;
                case 'Visual':
                    navigate('/visual');
                    break;
                default:
                    navigate('/resultado');
                    break;
            }
        } else {
            navigate('/resultado');
        }
    }, [pMin, navigate]); // Ejecuta el efecto solo cuando pMin cambie
    


    return (
        <div className="resultado-contenedor">
            <h1 className="resultado-titulo">Resultados del Cuestionario de Estilos de Aprendizaje</h1>
            <p className="resultado-descripcion">A continuación, se muestra el porcentaje de afinidad con cada estilo de aprendizaje:</p>
            <div className="resultado-lista">
                {resultados.map((resultado, index) => (
                    <div key={index} className="resultado-item">
                        <h2>{resultado.estilo}</h2>
                        <div className="barra-contenedor">
                            <div
                                className="barra-progreso"
                                style={{ width: `${progress[index]}%` }}
                            ></div>
                        </div>
                        <p className="porcentaje">{Math.round(progress[index])}%</p>
                    </div>
                ))}
                <p>
                    Para mejorar tu rendimiento en el área de <b>{pMin && (
    <p>
        Para mejorar tu rendimiento en el área de <b>{pMin.estilo}</b>, te recomendamos revisar la siguiente información.
        <br />
        <a className='vinculo' href={x} target="_blank" rel="noopener noreferrer">Visitar Ejemplo</a>
    </p>
)}</b>
                </p>
            </div>
            <button className="cta" onClick={handleBackClick}>
                <span>Regresar al Inicio</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
            </button>

            <div className="stars-container">
                <FontAwesomeIcon icon={faStar} className="star-icon star-6" />
                <FontAwesomeIcon icon={faStar} className="star-icon star-7" />
                <FontAwesomeIcon icon={faStar} className="star-icon star-8" />
                <FontAwesomeIcon icon={faStar} className="star-icon star-9" />
                <FontAwesomeIcon icon={faStar} className="star-icon star-10" />
            </div>
        </div>
    );
};

export default Resultado;
