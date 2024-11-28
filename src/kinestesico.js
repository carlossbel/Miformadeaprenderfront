import React from "react";
import "./kinestesico.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Kinestésico = () => {
  return (
    <div className="learning-visual-container">
      <h1 className="title">Mejora tu Estilo de Aprendizaje Kinestésico</h1>
      <p className="description">
      El aprendizaje kinestésico se centra en realizar actividades prácticas, experimentar y usar el movimiento para adquirir y retener conocimientos.
      </p>

      <div className="resources-section">
        {}
        <div className="resource">
          <h2 className="resource-title">Videos Recomendados</h2>
          <div className="videos-container">
          <iframe width="1200" height="600" 
          src="https://www.youtube.com/embed/wXDNSBmwhzQ?si=zA0jjTZtQOz644ha" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
          </iframe>
          <iframe width="1200" height="600" 
          src="https://www.youtube.com/embed/IoH97PYq0XQ?si=jF92DXGF7rt-tEgM" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
          </iframe>
          </div>
        </div>

        {}
        <div className="resource">
          <h2 className="resource-title">Documentos Útiles</h2>
          <ul className="documents-list">
            <li>
              <a
                href="https://lunamendoza.weebly.com/uploads/4/2/1/3/42137187/kinestsico.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Estilo de aprendizaje Kinestésico-PDF
              </a>
            </li>
            <li>
              <a
                href="https://repositorio.udla.cl/xmlui/bitstream/handle/udla/720/a41375.pdf?sequence=1&isAllowed=y"
                target="_blank"
                rel="noopener noreferrer"
              >
                Estilo de aprendizaje Kinestésico aplicado-PDF
              </a>
            </li>
          </ul>
        </div>

        {}
        <div className="resource">
          <h2 className="resource-title">Audios Educativos</h2>
          <div className="audio-container">
            <audio controls className="audio-player">
              <source src="https://example.com/audio1.mp3" type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <audio controls className="audio-player">
              <source src="https://example.com/audio2.mp3" type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      </div>
      <div className="stars-container">
        <FontAwesomeIcon icon={faStar} className="star-icon star-12" />
        <FontAwesomeIcon icon={faStar} className="star-icon star-56" />
      </div>
    </div>
  );
};

export default Kinestésico;
