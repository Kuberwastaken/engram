import React from 'react';

const Stars = () => {
  const numStars = 100;
  const stars = Array.from({ length: numStars }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    };
    return <div key={i} className="star absolute bg-white rounded-full" style={style} />;
  });

  return <div className="fixed top-0 left-0 w-full h-full pointer-events-none">{stars}</div>;
};

export default Stars;
