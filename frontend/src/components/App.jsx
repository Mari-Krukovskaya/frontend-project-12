import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import WSocketProvider from '../contexts/SocketContext.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import store from '../slices/store.js';
import resources from '../locales/index.js';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
    <Provider store={store}>
      <WSocketProvider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/signUp" element={<SignUpForm />} />
              </Routes>
            </BrowserRouter>
          </I18nextProvider>
        </AuthProvider>
      </WSocketProvider>
    </Provider>
  );
};

export default App;
