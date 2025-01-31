// src/components/Footer/Footer.jsx
import React from 'react';
import './footer.css'; // Import styles specific to the Footer

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
