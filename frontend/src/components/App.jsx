import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import Nav from './NavBar.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import routes from '../routes.js';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={routes.home()} element={<Nav />}>
        <Route index element={<HomePage />} />
        <Route path={routes.login()} element={<Login />} />
        <Route path={routes.signUp()} element={<SignUpForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
