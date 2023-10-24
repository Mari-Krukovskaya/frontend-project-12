import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Nav from '../components/NavBar.jsx';
import api from '../routes/api';
import entry from '../images/entry.jpg';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object().shape({
    username: Yup.string().required(`${t('AuthForm.ValidForm.required')}`),
    password: Yup.string().required(`${t('AuthForm.ValidForm.required')}`),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: null,
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
          setAuthError(`${t('AuthForm.ValidForm.notExist')}`);
        }
        setAuthError(true);
        throw error;
      }
    },
  });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <Nav />
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
                        alt={t('AuthForm.logIn')}
                      />
                    </div>
                    <Form
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                      noValidate
                    >
                      <h1 className="text-center mb-4">
                        {t('AuthForm.logIn')}
                      </h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          id="username"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          placeholder={t('AuthForm.name')}
                          className="form-control"
                          isInvalid={touched.username && errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                        <Form.Label htmlFor="username">
                          {t('AuthForm.name')}
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          type="password"
                          id="password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder={t('Auth.password')}
                          className="form-control"
                          isInvalid={
                            (touched.password && errors.password) || authError
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                        <Form.Label className="form-label" htmlFor="password">
                          {t('AuthForm.password')}
                        </Form.Label>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100 mb-3"
                        variant="outline-primary"
                      >
                        {t('AuthForm.buttonLogIn')}
                      </Button>
                    </Form>
                    <div className="card-footer p-4">
                      <div className="text-center">
                        <span>{t('AuthForm.noAcc')}</span>
                        <Link to="/login">{t('AuthForm.signUp')}</Link>
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
