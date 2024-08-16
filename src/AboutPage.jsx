import React from 'react';
import Header from "./Legos/Header.jsx"
import CardFeed from "./Legos/CardFeed.jsx"
import Card from "./Legos/Card.jsx"
import './index.css';

function OurCom() {
  return(
  <div>
    <Header></Header>
    <div className="img-strip">
      <img src="./src/assets/cauc.jpg" alt="Description of image" style={{ maxWidth: '100%', height: 'auto' }}/>
    </div>
    <h1 className="com-name">Quem Somos.</h1>
    <div className="main-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div className="feed-container" style={{ flex: '1', minWidth: '300px' }}>
        <Card
          caption="Hello"
          description="Im Ian"
        />
        <Card
          caption="Hello"
          description="Im Ian"
          imagePath="newton.jpeg"
        />

        <Card
          caption="Hello"
          description="Im Ian"
          imagePath="newton.jpeg"
        />


      </div>
    </div>
  </div>
  );
}

export default OurCom;