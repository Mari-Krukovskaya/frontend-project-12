import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.js';

const SignUpForm = () => {
  const [authError, setAuthError] = useState(false);
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    username: yup.string()
      .min(3, t('signUp.validSignUp.usernameMinMax'))
      .max(20, t('signUp.validSignUp.usernameMinMax'))
      .required(t('signUp.validSignUp.required')),
    password: yup.string()
      .min(6, t('signUp.validSignUp.passwordMin'))
      .required(t('signUp.validSignUp.required')),
    confirmPassword: yup.string()
      .required(t('signUp.validSignUp.required'))
      .oneOf(
        [yup.ref('password'), null],
        t('signUp.validSignUp.confirmPassword'),
      ),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setAuthError(false);
      const response = await axios.post(api.signUpPath(), {
        username: values.username,
        password: values.password,
      });
      auth.login(response.data);
      navigate(api.home());
    } catch (error) {
      if (error.isAxiosError && error.response.status === 409) {
        setAuthError(true);
        inputRef.current.select();
      } else if (error.code === 'ERR_NETWORK') {
        toast.error(`${t('toasts.connectError')}`);
      }
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: (values) => handleSubmit(values),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const isInvalidUsername = formik.touched.username && formik.errors.username;
  const isInvalidPassword = formik.touched.password && formik.errors.password;
  const isInvalidPassConfirm = formik.touched.passwordConfirm && formik.errors.passwordConfirm;

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <Image
                  src={signUp}
                  width={250}
                  height={250}
                  roundedCircle
                  alt={t('signUp.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50" noValidate>
                <h1 className="text-center mb-4">{t('signUp.registration')}</h1>
                <fieldset>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      type="text"
                      placeholder={t('signUp.validSignUp.usernameMinMax')}
                      name="username"
                      required
                      id="username"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      ref={inputRef}
                      isInvalid={isInvalidUsername || authError}
                    />
                    <Form.Label>{t('signUp.username')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip placement="right">
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
                      isInvalid={isInvalidPassword || authError}
                    />
                    <Form.Label>{t('signUp.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
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
                      isInvalid={isInvalidPassConfirm || authError}
                    />
                    <Form.Label>{t('signUp.validSignUp.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.confirmPassword) || t('signUp.validSignUp.alreadyExists')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={formik.isSubmitting}
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
