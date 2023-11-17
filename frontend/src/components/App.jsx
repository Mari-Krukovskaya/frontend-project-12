import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import Nav from './NavBar.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import api from '../routes/api.js';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={api.home()} element={<Nav />}>
        <Route index element={<HomePage />} />
        <Route path={api.login()} element={<Login />} />
        <Route path={api.signUp()} element={<SignUpForm />} />
        <Route path={api.error()} element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
