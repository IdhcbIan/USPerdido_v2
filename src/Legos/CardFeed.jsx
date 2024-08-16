// src/Legos/CardFeed.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Legos.css';

const CardFeed = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/cards')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setCards(data))
      .catch(error => {
        console.error('Error fetching cards:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cards.length === 0) {
    return <div>Loading cards...</div>;
  }

  return (
    <div className="card-feed">
      {cards.map((card, index) => (
        <Card
          key={index}
          caption={card.caption}
          description={card.description}
          imagePath={card.imagePath}
        />
      ))}
    </div>
  );
};

export default CardFeed;