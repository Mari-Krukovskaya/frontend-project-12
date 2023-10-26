import React from 'react';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import filter from 'leo-profanity';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
// import HomePage from '../pages/HomePage.jsx';
import Nav from './NavBar.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import WSocketProvider from '../contexts/SocketContext.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import resources from '../locales/index.js';
import api from '../routes/api.js';

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  debug: true,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));

const App = () => {
  return (
    <WSocketProvider>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path={api.home()} element={<Nav />} />
              <Route path={api.login()} element={<Login />} />
              <Route path={api.signUp()} element={<SignUpForm />} />
              <Route path={api.error()} element={<NotFoundPage />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </I18nextProvider>
      </AuthProvider>
    </WSocketProvider>
  );
};

export default App;
