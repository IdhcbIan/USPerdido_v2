import React, { useState, useEffect } from 'react';
import { useAuth } from './Legos/AuthContext';
import Header from "./Legos/Header.jsx"
import Feed from "./Legos/Feed.jsx"
import ComDesc from "./Legos/ComDesc.jsx"
import './index.css';

function MainFeed() {
  const { user } = useAuth();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/db/Users/users.json');
        const data = await response.json();
        // Assuming the JSON file contains an array of users
        // and we want to find the user by their username
        const foundUser = data.find(u => u.username === user.username);
        if (foundUser) {
          setLocalUser(foundUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [user.username]);

  return(
    <>
      <Header />
      <div className="img-strip">
        <img src="./src/assets/cauc.jpg" alt="Description of image"/>
      </div>
      <h1 className="com-name">Bem-Vindo De Volta, {localUser ? localUser.name : user.username}!!</h1>
      <div className="main-container">
        <div className="feed-container">
          <Feed />
        </div>
        <ComDesc community="Main"/>
      </div>
    </>
  );
}

export default MainFeed;
