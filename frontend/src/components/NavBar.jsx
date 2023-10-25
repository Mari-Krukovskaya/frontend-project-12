import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../routes/api';

const Nav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleBtnClick = () => {
    auth.logout();
    navigate(api.login());
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand
            as={Link}
            to={api.home()}
            state={{ from: location }}
            className="navbar-brand"
          >
            {t('nav.chat')}
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" />
        {auth.loggedIn ? (
          <Button onClick={handleBtnClick}>{t('nav.exit')}</Button>
        ) : (
          <Button onClick={() => navigate(api.login())}>{t('nav.login')}</Button>
        )}
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};
export default Nav;
