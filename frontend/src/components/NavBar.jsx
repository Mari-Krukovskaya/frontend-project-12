import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Nav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const btnClick = token ? `${t('Nav.exit')}` : `${t('Nav.login')}`;

  const handleBtnClick = () => {
    if (token) {
      logout();
    }
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            state={{ from: location }}
            className="navbar-brand"
          >
            {t('Nav.chat')}
          </Navbar.Brand>
          <Button onClick={handleBtnClick} variant="primary">{btnClick}</Button>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};
export default Nav;
