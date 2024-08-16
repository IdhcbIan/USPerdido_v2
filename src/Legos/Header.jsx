import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import imageFile from '../assets/icons/menu.png';
import SideBar from './SideBar.jsx';
import './Legos.css';

function Header() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const { user, logout } = useAuth();

  const OpenSB = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const closeSidebar = () => {
    setIsComponentVisible(false);
  };

  return (
    <>
      <header className="MainHeader">
        <div className="Header-Right Side">
          <img src={imageFile} onClick={OpenSB} alt="Menu Icon" />
          <Link to="/">
            <h1 className="HeaderText">USPerdido</h1>
          </Link>
        </div>
        <div className="auth-links">
          {user ? (
            <>
              <Link to="/Profile" className="profile-link">Meu Perfil</Link>
              <button onClick={logout} className="logout-button">Logout</button>
            </>
          ) : (
            <Link to="/" className="login-link">Login</Link>
          )}
        </div>
      </header>
      {isComponentVisible && <SideBar closeSidebar={closeSidebar} />}
    </>
  );
}

export default Header;