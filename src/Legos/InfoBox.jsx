import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Legos.css';

const InfoBox = () => {
  const [position, setPosition] = useState(50);
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    if (boxRef.current) {
      setBoxWidth(boxRef.current.offsetWidth);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!boxRef.current || !imageRef.current) return;

    const box = boxRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - box.left;
    
    const imageCenter = position / 100 * boxWidth;
    const runDirection = mouseX < imageCenter ? 1 : -1;
    
    const distance = Math.abs(mouseX - imageCenter);
    const newPosition = position + runDirection * (distance / 10);

    // Clamp the position between 0 and 100
    setPosition(Math.max(5, Math.min(95, newPosition)));
  };

  return (
    <div 
      className="info-box" 
      ref={boxRef} 
      onMouseMove={handleMouseMove}
    >
      <img
        className="lost info-box-image"
        src="./src/assets/lost.png"
        alt="Lost"
        ref={imageRef}
        style={{
          left: `${position}%`,
        }}
      />
      <h3>Get to know our tutors and offered courses!</h3>
      <Link class="DLink" to="/OurCom">Our Community</Link>
    </div>
  );
};

export default InfoBox;