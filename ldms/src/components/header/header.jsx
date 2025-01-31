// src/components/Header/Header.jsx
import React from 'react';
import './header.css'; // Import styles specific to the Header
import logoImage from "../../assets/images/logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className='logo'>
        <img src={logoImage} alt='deepseek logo' className='h-12' />
      </div>
    </header>
  );
};

export default Header;
