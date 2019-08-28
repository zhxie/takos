import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Cross-platform schedule and battle statistic client of Splatoon 2.
        </p>
        <a
          className="App-link"
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

export default App;
