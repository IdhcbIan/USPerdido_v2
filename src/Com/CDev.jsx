import React from 'react';
import Header from "../Legos/Header.jsx"
import Feed from "../Legos/Feed.jsx"
import ComDesc from "../Legos/ComDesc.jsx"
import '../index.css';

function CDev() {
  return(
    <>
      <Header />
      <div className="img-strip">
        <img src="./src/assets/fisI_b.webp"/>
      </div>
      <h1 className="com-name">u/CDev</h1>
      <div className="main-container">
        <div className="feed-container">
          <Feed community="CDev" />
        </div>
      <ComDesc community="CDev"/>
      </div>
    </>
  );
}

export default CDev;