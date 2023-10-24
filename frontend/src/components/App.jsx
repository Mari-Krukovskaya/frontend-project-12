import React from 'react';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import WSocketProvider from '../contexts/SocketContext.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import resources from '../locales/index.js';

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  debug: true,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

const App = () => {
  return (
      <WSocketProvider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUpForm />} />
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <ToastContainer />
            </BrowserRouter>
          </I18nextProvider>
        </AuthProvider>
      </WSocketProvider>
  );
};

export default App;
