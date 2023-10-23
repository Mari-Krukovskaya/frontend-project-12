import React from 'react';
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export const NavBar = () => {
    const { logout } = useContext(AuthContext);
    return (
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                <Link href="/" className="navbar-brand">Hexlet Chat</Link>
                <Button type="button" className="btn btn-primary" onClick={logout}>Выйти</Button>
            </div>
        </nav>
    )
};
