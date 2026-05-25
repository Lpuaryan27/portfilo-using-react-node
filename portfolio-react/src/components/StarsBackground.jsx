import React, { useEffect, useState } from 'react';

const StarsBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starCount = 80;
    const generatedStars = [];
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 4}s`,
        size: Math.random() > 0.8 ? '3px' : '1.5px',
      });
    }
    setStars(generatedStars);
  }, []);

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--delay': star.delay,
            '--duration': star.duration,
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;
