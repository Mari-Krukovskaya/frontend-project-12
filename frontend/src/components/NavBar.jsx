import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext.js';
import api from '../routes/api';

const Nav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const handleBtnClick = () => {
    if (auth.user) {
      auth.logout();
    }
    navigate(api.login());
  };

  return (
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand href="/" className="navbar-brand">
            {t('nav.chat')}
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" />

          {auth.user ? (
            <Button onClick={handleBtnClick}>{t('nav.exit')}</Button>
          ) : (
            null
          )}
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};
export default Nav;
