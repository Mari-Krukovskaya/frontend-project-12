import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import WSocketProvider from '../contexts/SocketContext.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import store from '../slices/store.js';

const App = () => {
  return (
    <Provider store={store}>
      <WSocketProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/signUp" element={<SignUpForm />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </WSocketProvider>
    </Provider>
  );
};

export default App;
