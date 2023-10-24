import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const NavBar = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  return (
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                <Link href="/" className="navbar-brand">{t('Nav.chat')}</Link>
                <Button type="button" className="btn btn-primary" onClick={logout}>Выйти</Button>
            </div>
        </nav>
  );
};
export default NavBar;
