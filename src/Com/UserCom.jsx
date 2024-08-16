import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../Legos/Header.jsx"
import UserFeed from "../Legos/UserFeed.jsx"
import ComDesc from "../Legos/ComDesc.jsx"
import '../index.css';

const UserCom = () => {
  const location = useLocation();
  const username = location.state?.username;

  return(
    <>
      <Header />
      <div className="img-strip">
        <img src="./src/assets/cauc.jpg" alt="Description of image"/>
      </div>
      <h1 className="com-name">Posts By: {username}</h1>
      <div className="main-container">
        <div className="feed-container">
          <UserFeed username={username} />
        </div>
        <ComDesc community="C2"/>
      </div>
    </>
  );
}

export default UserCom;
