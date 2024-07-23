// src/components/Footer.js
import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div>
          &copy; 2024 MMM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
