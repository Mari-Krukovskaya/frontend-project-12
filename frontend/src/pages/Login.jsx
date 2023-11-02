import React, { useContext, useRef, useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../routes/api';
import entry from '../images/entry.jpg';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const inputRef = useRef(null);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => inputRef.current.focus(), []);

  const validation = Yup.object().shape({
    username: Yup.mixed().required(t('authForm.validForm.required')),
    password: Yup.mixed().required(t('authForm.validForm.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validation,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      try {
        const { data } = await axios.post(api.loginPath(), { username, password });
        login(data);
        setAuthError(false);
        navigate(api.home());
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          setAuthError(true);
          return;
        }
        toast.error(`${t('toasts.connectError')}`);
      } finally {
        setSubmitting(false);
      }
    },
  });
  const { handleSubmit, handleChange, values, errors, touched } = formik;
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={entry}
                  width={250}
                  height={250}
                  className="rounded-circle"
                  alt={t('authForm.logIn')}
                />
              </div>
              <Form
                onSubmit={handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('authForm.logIn')}</h1>
                <Form.Floating className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    placeholder={t('authForm.name')}
                    required
                    autoComplete="username"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={values.username}
                    isInvalid={authError}
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">
                    {t('authForm.name')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip={errors.username && touched.username}>
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    placeholder={t('auth.password')}
                    required
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    value={values.password}
                    isInvalid={authError}
                    ref={inputRef}
                  />
                  <Form.Label className="form-label" htmlFor="password">
                    {t('authForm.password')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t('authForm.validForm.notExist')}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button
                  type="submit"
                  className="w-100 mb-3"
                  variant="outline-primary"
                >
                  {t('authForm.buttonLogIn')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('authForm.noAcc')}
                  {' '}
                </span>
                <Link to={api.signUp()}>{t('authForm.signUp')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
