import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { EmployeeProvider } from './context/EmployeeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <EmployeeProvider>
          <App />
        </EmployeeProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
