import React from 'react';
import logo from './logo.svg';
import './Splash.css';

function Splash() {
  return (
    <div className="Splash">
      <header className="Splash-header">
        <img src={logo} className="Splash-logo" alt="logo" />
        <p>
          Cross-platform schedule and battle statistic client of Splatoon 2.
        </p>
        <a
          className="Splash-link"
          href="https://ikas.ink"
          target="_blank"
          rel="noopener noreferrer"
        >
          ikas.ink
        </a>
      </header>
    </div>
  );
}

export default Splash;
