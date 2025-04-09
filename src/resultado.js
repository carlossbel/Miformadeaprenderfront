import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './resultado.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import alertService from './alertService';

const Resultado = () => {
    const navigate = useNavigate();
    const [resultados, setResultados] = useState([]);
    const [progress, setProgress] = useState([0, 0, 0]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL de la API con respaldo
    const API_URL = process.env.REACT_APP_API_URL || 'https://backend-miformadeaprender.onrender.com';

    // Obtener el userId de localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            setError('No se encontró ID de usuario.');
            alertService.error('No se encontró ID de usuario');
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
                    setLoading(true);
                    alertService.info('Cargando resultados...');
                    const response = await fetch(`${API_URL}/auth/getpuntos/${userId}`);
                    
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Datos recibidos:', data);

                    setResultados([
                        { estilo: "Visual", porcentaje: parseFloat(data.visual) || 0 },
                        { estilo: "Auditivo", porcentaje: parseFloat(data.auditivo) || 0 },
                        { estilo: "Kinestésico", porcentaje: parseFloat(data.kinestesico) || 0 },
                    ]);
                    
                    alertService.success('Resultados cargados correctamente');
                    setLoading(false);
                } catch (error) {
                    console.error('Error al obtener los resultados:', error);
                    setError('Error al cargar los resultados. Por favor, intenta nuevamente.');
                    alertService.error('Error al cargar los resultados');
                    setLoading(false);
                }
            };

            fetchResultados();
        }
    }, [userId, API_URL]);

    // Animación de las barras de progreso
    useEffect(() => {
        if (resultados.length > 0 && !loading) {
            const intervalIds = resultados.map((resultado, index) => {
                return setInterval(() => {
                    setProgress((prevProgress) => {
                        const newProgress = [...prevProgress];
                        if (newProgress[index] < resultado.porcentaje) {
                            newProgress[index] = Math.min(newProgress[index] + 1, resultado.porcentaje);
                        } else {
                            clearInterval(intervalIds[index]);
                        }
                        return newProgress;
                    });
                }, 20); // Velocidad de animación ajustada
            });

            return () => intervalIds.forEach((id) => clearInterval(id));
        }
    }, [resultados, loading]);

    // Navegar al inicio
    const handleBackClick = () => {
        navigate('/'); 
    };

    // Determinar el estilo con el porcentaje más bajo para las recomendaciones
    const pMin = resultados.length > 0 
        ? resultados.reduce((min, item) =>
            item.porcentaje < min.porcentaje ? item : min, resultados[0])
        : null;

    // Determinar la ruta de redirección según el estilo con menor porcentaje
    let redirectPath = '';
    if (pMin && pMin.estilo) {
        switch (pMin.estilo.toLowerCase()) {
            case 'kinestésico':
            case 'kinestesico':
                redirectPath = '/kinestesico';
                break;
            case 'auditivo':
                redirectPath = '/auditivo';
                break;
            case 'visual':
                redirectPath = '/visual';
                break;
            default:
                redirectPath = '/resultado';
                break;
        }
    }

    // Función para redireccionar a la página de recomendaciones
    const handleVisitExample = () => {
        if (redirectPath) {
            alertService.info(`Cargando recomendaciones para estilo ${pMin.estilo}...`);
            navigate(redirectPath); 
        } else {
            alertService.warning('No se pudo determinar el estilo para recomendaciones');
        }
    };
    
    // Si está cargando, mostrar indicador
    if (loading) {
        return (
            <div className="resultado-contenedor">
                <div className="loading">
                    <svg width="50" height="50" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#f3f3f3" />
                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#2684ff" strokeDasharray="125" strokeDashoffset="125" strokeLinecap="round">
                            <animate attributeName="stroke-dashoffset" values="125;0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <p>Cargando resultados...</p>
                </div>
                
                <div className="stars-container">
                    {[...Array(50)].map((_, index) => (
                        <FontAwesomeIcon 
                            key={index} 
                            icon={faStar} 
                            className={`star-icon star-${index + 1}`} 
                            style={{
                                fontSize: `${0.5 + Math.random() * 1}rem`,
                                opacity: 0.1 + Math.random() * 0.6
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
            <div className="resultado-contenedor">
                <h1 className="resultado-titulo">Error</h1>
                <p className="resultado-descripcion">{error}</p>
                <button className="cta" onClick={handleBackClick}>
                    <span>Regresar al Inicio</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5" stroke="white" strokeWidth="2" />
                        <polyline points="8 1 12 5 8 9" stroke="white" fill="none" strokeWidth="2" />
                    </svg>
                </button>
                
                <div className="stars-container">
                    {[...Array(50)].map((_, index) => (
                        <FontAwesomeIcon 
                            key={index} 
                            icon={faStar} 
                            className={`star-icon star-${index + 1}`}
                            style={{
                                fontSize: `${0.5 + Math.random() * 1}rem`,
                                opacity: 0.1 + Math.random() * 0.6
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

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
            </div>
            
            {pMin && (
                <div className="recomendacion">
                    <p>
                        Para mejorar tu rendimiento en el área de <strong>{pMin.estilo}</strong>, te recomendamos revisar la siguiente información y realizar los ejercicios sugeridos. Esto te ayudará a desarrollar estrategias de aprendizaje más efectivas para este estilo.
                    </p>
                    
                    {/* Pequeñas sugerencias específicas según el estilo */}
                    <div className="quick-tips">
                        <h3>Sugerencias rápidas:</h3>
                        {pMin.estilo.toLowerCase() === 'visual' && (
                            <ul>
                                <li>Utiliza mapas mentales y diagramas para estudiar</li>
                                <li>Trabaja con códigos de colores para organizar información</li>
                                <li>Convierte conceptos abstractos en imágenes</li>
                            </ul>
                        )}
                        {pMin.estilo.toLowerCase() === 'auditivo' && (
                            <ul>
                                <li>Graba las clases y reprodúcelas después</li>
                                <li>Lee en voz alta cuando estudies</li>
                                <li>Participa en debates y discusiones sobre el tema</li>
                            </ul>
                        )}
                        {(pMin.estilo.toLowerCase() === 'kinestésico' || pMin.estilo.toLowerCase() === 'kinestesico') && (
                            <ul>
                                <li>Estudia en movimiento, caminando mientras repasas</li>
                                <li>Usa modelos físicos o maquetas cuando sea posible</li>
                                <li>Haz pausas activas frecuentes durante tus sesiones de estudio</li>
                            </ul>
                        )}
                    </div>
                </div>
            )}
            
            <div className="buttons-container">
                {pMin && (
                    <button className="cta recommendation-button" onClick={handleVisitExample}>
                        <span className="hover-underline-animation">Ver Recursos Completos</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="10"
                            viewBox="0 0 46 16"
                        >
                            <path
                                d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                                transform="translate(30)"
                                fill="white"
                            ></path>
                        </svg>
                    </button>
                )}
            
                <button className="cta" onClick={handleBackClick}>
                    <span>Regresar al Inicio</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5" stroke="white" strokeWidth="2" />
                        <polyline points="8 1 12 5 8 9" stroke="white" fill="none" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            <div className="stars-container">
                {[...Array(50)].map((_, index) => (
                    <FontAwesomeIcon 
                        key={index} 
                        icon={faStar} 
                        className={`star-icon star-${index + 1}`}
                        style={{
                            fontSize: `${0.5 + Math.random() * 1}rem`,
                            opacity: 0.1 + Math.random() * 0.6
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Resultado;