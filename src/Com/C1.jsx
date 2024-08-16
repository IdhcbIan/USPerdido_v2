import React from 'react';
import Header from "../Legos/Header.jsx"
import Feed from "../Legos/Feed.jsx"
import ComDesc from "../Legos/ComDesc.jsx"
import '../index.css';

function C1() {
  return(
    <>
      <Header />
      <div className="img-strip">
        <img src="./src/assets/test2.webp" alt="Description of image"/>
      </div>
      <h1 className="com-name">u/Cauculo I</h1>
      <div className="main-container">
        <div className="feed-container">
          <Feed community="C1" />
        </div>
        <ComDesc community="C1"/>
      </div>
    </>
  );
}

export default C1;