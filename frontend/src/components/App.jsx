import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import Nav from './NavBar.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import api from '../routes/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const StartRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to={api.login()} state={{ from: location }} />
  );
};

// const user = localStorage.getItem('user');
const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path={api.home()} element={<HomePage />} />
        <Route path={api.login()} element={<Login />} />
        <Route path={api.signUp()} element={<SignUpForm />} />
        <Route path={api.error()} element={<NotFoundPage />} />
        <Route
          path={api.home()}
          element={(
            <StartRoute>
              <HomePage />
            </StartRoute>
  )}
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
