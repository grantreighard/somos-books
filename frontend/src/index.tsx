import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppContextProvider from './contexts/appContext';
import App from './App';
import Login from './components/Login';
import Search from './components/Search';
import Favorites from './components/Favorites';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    
    <Auth0Provider
    domain="https://ghr-somos.us.auth0.com"
    clientId="nJtJ1oWvbQxF38iNKPEVP46qYfqooowR"
    authorizationParams={{
      redirect_uri: 'http://localhost:3000'
    }}
  >
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </BrowserRouter>
     </AppContextProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
