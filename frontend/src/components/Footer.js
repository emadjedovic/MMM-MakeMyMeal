// src/components/Footer.js
import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <div>
          &copy; 2024 MMM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
