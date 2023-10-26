import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
// import HomePage from '../pages/HomePage.jsx';
import Nav from './NavBar.jsx';
import SignUpForm from '../pages/SignUpForm.jsx';
import api from '../routes/api.js';

// const PrivateRoute = ({ children }) => {
//   const { loggedIn } = useContext(AuthContext);
//   return loggedIn ? children : <Navigate to={api.login()} />
// };

const App = () => {
  return (
    <BrowserRouter>
        <Nav />
        <Routes>
          {/* <Route path={api.home()} element={<HomePage />} /> */}
          <Route path={api.login()} element={<Login />} />
          <Route path={api.signUp()} element={<SignUpForm />} />
          <Route path={api.error()} element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
