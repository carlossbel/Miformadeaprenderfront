import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './StarBackground.css';

const StarBackground = () => {
  const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

  const stars = Array.from({ length: 50 }, (_, index) => ({
    id: index,
    top: `${getRandomNumber(0, 100)}%`,
    left: `${getRandomNumber(0, 100)}%`,
    size: `${getRandomNumber(0.5, 2)}rem`,
    delay: `${getRandomNumber(0, 5)}s`,
    duration: `${getRandomNumber(20, 60)}s`
  }));

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <FontAwesomeIcon
          key={star.id}
          icon={faStar}
          className="star-icon"
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;