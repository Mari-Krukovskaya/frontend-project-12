import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, Image, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.js';

const SignUpForm = () => {
  const [authError, setAuthError] = useState(false);
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => inputRef.current.focus(), []);

  const validScema = yup.object().shape({
    username: yup
      .string()
      .required(t('signUp.validSignUp.required'))
      .min(3, t('signUp.validSignUp.usernameMinMax'))
      .max(20, t('signUp.validSignUp.usernameMinMax')),
    password: yup
      .string()
      .required(t('signUp.validSignUp.required'))
      .min(6, t('signUp.validSignUp.passwordMin')),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        t('signUp.validSignUp.confirmPassword'),
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validScema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      setAuthError(false);
      try {
        const { data } = await axios.post(api.signUpPath(), {
          username: values.username,
          password: values.password,
        });
        login(data);
        navigate(api.home());
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
          setAuthError(true);
          inputRef.current.select();
          return;
        }
        if (error.code === 'ERR_NETWORK') {
          toast.error(`${t('toasts.connectError')}`);
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <Image
                  src={signUp}
                  roundedCircle
                  alt={t('signUp.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <fieldset disabled={formik.isSubmitting}>
                  <h1 className="text-center mb-4">
                    {t('signUp.registration')}
                  </h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      type="text"
                      name="username"
                      id="username"
                      value={formik.values.username}
                      placeholder={t('signUp.validSignUp.usernameMinMax')}
                      autoComplete="username"
                      required
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      ref={inputRef}
                      isInvalid={(formik.touched.username && formik.errors.username) || authError}
                    />
                    <Form.Label htmlFor="username">
                      {t('signUp.username')}
                    </Form.Label>
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                      placement="right"
                    >
                      {t(formik.errors.username)}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      type="password"
                      placeholder={t('signUp.validSignUp.passwordMin')}
                      name="password"
                      id="password"
                      required
                      autoComplete="new-password"
                      aria-describedby="passwordHelpBlock"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={(formik.touched.password && formik.errors.password) || authError}
                    />
                    <Form.Label htmlFor="password">
                      {t('signUp.password')}
                    </Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      placeholder={t('signUp.confirmPassword')}
                      name="confirmPassword"
                      required
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={(formik.touched.confirmPassword && formik.errors.confirmPassword)
                      || authError}
                    />
                    <Form.Label htmlFor="confirmPassword">
                      {t('signUp.confirmPassword')}
                    </Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                    {authError === false ? formik.errors.confirmPassword : t('signUp.validSignUp.alreadyExists')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    className="w-100"
                    type="submit"
                    variant="outline-primary"
                  >
                    {t('signUp.buttonRegister')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
