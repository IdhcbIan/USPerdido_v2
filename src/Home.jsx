import React from 'react';
import { Link } from 'react-router-dom';
import Header from "./Legos/Header.jsx";
import InfoBox from "./Legos/InfoBox.jsx";
import LoginBox from "./Legos/LoginBox.jsx";

function Home() {
  return (
    <>
    <Header />
    <div className="Content">
      <div className="img-strip">
        <img src="./src/assets/cauc.jpg" alt="Caucasus" />
      </div>

      <div className="introduction">
        <h1>Welcome To USPerdido</h1>
        <h2>Your new study group!!</h2>
      </div>

      <div className="login-box">
        <h2>Join the community!</h2>
        <LoginBox className="LoginBox"/>
      </div>

      <InfoBox/>

      <nav>
      </nav>
    </div>
    </>
  );
}

export default Home;