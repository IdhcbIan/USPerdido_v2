import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import Header from "./Header.jsx";
import UserFeed from "./UserFeed.jsx";
import '../index.css';
import './Legos.css';

function Profile() {
  const { user } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/db/Users/users.json');
        const data = await response.json();
        const foundUser = data.find(u => u.username === user.username);
        if (foundUser) {
          setLocalUser(foundUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [user]);

  if (!user || !localUser) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <div className="profile-box">
            <h1>Informacoes do Usuario</h1>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </>
    );
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="post-box">
          <h1>Informacoes do Usuario</h1>
          <p>Nome: {localUser.name}</p>
          <p>Email: {localUser.username}</p>
          <div>
            <p>
              Senha: {showPassword ? localUser.password : '••••••••'}
              <button onClick={togglePasswordVisibility}>
                {showPassword ? 'Esconder' : 'Mostrar'} 
              </button>
            </p>
          </div>
          {/* Conditional link */}
          {localUser.username === 'idhcb.ian@gmail.com' && (
            <p>
              <Link to="/CDev">Ir para Comunidade de Devs</Link>
            </p>
          )}
          {/* Add more user information here as needed */}
        </div>
        <UserFeed username={localUser.username} />
      </div>
    </>
  );
}

export default Profile;
