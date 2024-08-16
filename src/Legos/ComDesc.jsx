import React, { useState, useEffect } from 'react';
import './Legos.css';

const ComDesc = ({ community }) => {
  const [descData, setDescData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/desc')
      .then(response => response.json())
      .then(data => {
        if (data[community] && data[community].length > 0) {
          setDescData(data[community][0]);
        }
      })
      .catch(error => console.error('Error fetching desc data:', error));
  }, [community]);

  if (!descData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="com-box">
      <h2>{descData.caption}</h2>
      <hr />
      <div>
        <p>{descData.description}</p>
      </div>
    </div>
  );
};

export default ComDesc;