// src/Legos/Card.jsx
import React, { useState } from 'react';
import './Legos.css';

const Card = ({ caption, description, imagePath }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="card">
      <h2>{caption}</h2>
        <hr />
      <div class="SideBySide">
        {!imageError ? (
            <img 
            src={`http://localhost:3001/api/comcards/${imagePath}`} 
            onError={() => setImageError(true)}
            style={{ maxWidth: '100%', height: 'auto' }}
            />
        ) : (
            <p>Error loading image</p>
        )}
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Card;