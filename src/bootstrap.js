import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Standalone shell only: the host provides its own <main> when it mounts ./NewsApp.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);
