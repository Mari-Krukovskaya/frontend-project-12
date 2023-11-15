import React, { useContext, useRef, useState, useEffect } from 'react';
import { Button, Card, Image, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

import { AuthContext } from '../contexts/AuthContext.js';
import api from '../routes/api.js';
import entry from '../images/entry.jpg';

const Login = () => {
  const [authError, setAuthError] = useState(false);
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const refInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => refInput.current.focus(), []);

  const validScema = yup.object().shape({
    username: yup.mixed().required(t('authForm.validForm.required')),
    password: yup.mixed().required(t('authForm.validForm.required')),
  });

  const formik = useFormik({
    validationSchema: validScema,
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        setAuthError(false);
        const response = await axios.post(api.loginPath(), {
          username: values.username,
          password: values.password,
        });
        // eslint-disable-next-line
        debugger;
        auth.login(response.data);
        navigate(api.home(), { replace: false });
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthError(t('authForm.validForm.notExist'));
          refInput.current.select();
          return;
        }
        if (error.code === 'ERR_NETWORK') {
          toast.error(`${t('toasts.connectError')}`);
        }
      }
      formik.setSubmitting(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  // const isDisabled = formik.isSubmitting;
  const isInvalidUsername = formik.touched.username && formik.errors.username;
  const isInvalidPassword = formik.touched.password && formik.errors.password;
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <Image
                  src={entry}
                  width={250}
                  height={250}
                  className="rounded-circle"
                  alt={t('authForm.logIn')}
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
                noValidate
              >
                <h1 className="text-center mb-4">{t('authForm.logIn')}</h1>
                <Form.Floating className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    placeholder="username"
                    required
                    autoComplete="username"
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={isInvalidUsername || authError}
                    ref={refInput}
                  />
                  <Form.Label htmlFor="username">
                    {t('authForm.name')}
                  </Form.Label>
                  <Form.Control.Feedback
                    type="invalid"
                    className="invalid-feedback"
                    tooltip
                  >
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    required
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={isInvalidPassword || authError}
                    ref={refInput}
                  />
                  <Form.Label className="form-label" htmlFor="password">
                    {t('authForm.password')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password || authError}
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
                <span>{t('authForm.noAcc')}</span>
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
