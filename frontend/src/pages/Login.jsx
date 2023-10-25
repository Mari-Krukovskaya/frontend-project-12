import React, { useContext, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../routes/api';
import entry from '../images/entry.jpg';
import Nav from '../components/NavBar.jsx';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object().shape({
    username: Yup.string().required(t('authForm.validForm.required')),
    password: Yup.string().required(t('authForm.validForm.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(api.loginPath(), values);
        login(data);
        setAuthError(false);
        navigate(api.home());
      } catch (error) {
        if (error.response.status === 401) {
          setAuthError(t('authForm.validForm.notExist'));
        }
        setAuthError(true);
        throw error;
      }
    },
  });
  const { handleSubmit, handleChange, values, errors } = formik;
  return (
    <div className="h-100 d-flex flex-column">
      <Nav />
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
                      autoFocus
                      autoComplete="username"
                      type="text"
                      id="username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      placeholder={t('authForm.name')}
                      className="form-control"
                      isInvalid={authError}
                      // isInvalid={touched.username && errors.username}
                    />
                    {/* <Form.Control.Feedback type="invalid" tooltip>
                        {t('authForm.required')}
                      </Form.Control.Feedback> */}
                    <Form.Label htmlFor="username">
                      {t('authForm.name')}
                    </Form.Label>
                  </Form.Floating>
                  <Form.Floating className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      autoFocus
                      value={values.password}
                      onChange={handleChange}
                      placeholder={t('auth.password')}
                      className="form-control"
                      isInvalid={authError}
                      // isInvalid={
                      //   (touched.password && errors.password) || authError
                      // }
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.password ?? t('authForm.required')}
                    </Form.Control.Feedback>
                    <Form.Label className="form-label" htmlFor="password">
                      {t('authForm.password')}
                    </Form.Label>
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
                  <span>{t('authForm.noAcc')}</span>
                  <Link to={api.signUp()}>{t('authForm.signUp')}</Link>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
