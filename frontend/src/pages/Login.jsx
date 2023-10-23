import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../routes/api';
import entry from '../images/entry.jpg';

const validation = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validation,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(false);
      try {
        const { data } = await axios.post(api.loginPath(), values);
        const { token } = data;
        localStorage.setItem('token', token);
        login(token);
        navigate('/');
      } catch (error) {
        setSubmitting(false);
        if (error.response && error.response.status === 401) {
          setAuthError('401');
        }
        setAuthError(true);
        throw error;
      }
    },
  });
  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
  } = formik;
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <nav className="shadow-sm navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet
              </a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img
                        src={entry}
                        width={250}
                        height={250}
                        className="rounded-circle"
                        alt="Войти"
                      />
                    </div>
                    <Form onSubmit={handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">Войти</h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          id="username"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          placeholder="Ваш ник"
                          className="form-control"
                          isInvalid={touched.username && errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        <Form.Label htmlFor="username">Ваш Ник</Form.Label>
                      </Form.Group>
                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          type="password"
                          id="password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Пароль"
                          className="form-control"
                          isInvalid={(touched.password && errors.password) || authError}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        <Form.Label className="form-label" htmlFor="password">
                          Пароль
                        </Form.Label>
                      </Form.Group>
                      <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                        Войти
                      </Button>
                    </Form>
                    <div className="card-footer p-4">
                      <div className="text-center">
                        <span>Нет аккаунта?</span>
                        <Link to="/login">Регистрация</Link>
                      </div>
                    </div>
                    <div className="text-danger text-center">{authError}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
