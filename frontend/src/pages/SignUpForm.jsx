import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const { login } = useContext(AuthContext);
  console.log(login, 'login');
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signUp.validSignUp.usernameMinMax'))
      .max(20, t('signUp.validSignUp.usernameMinMax'))
      .required(t('signUp.validSignUp.required')),
    password: Yup.string()
      .min(6, t('signUp.validSignUp.passwordMin'))
      .required(t('signUp.validSignUp.required')),
    confirmPassword: Yup.string()
      .required(t('signUp.validSignUp.required'))
      .oneOf([Yup.ref('password'), null], t('signUp.validSignUp.passwordConfirm')),
  });
  useEffect(() => refInput.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: validation,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(false);
      try {
        const { username, password } = values;
        const { data } = await axios.post(api.signUpPath(), {
          username,
          password,
        });
        login(data);
        navigate(api.home());
        formik.resetForm();
      } catch (error) {
        setSubmitting(false);

        if (error.isAxiosError && error.response.status === 409) {
          setAuthError(true);
          return;
        }
        toast.error(`${t('toasts.connectError')}`);
        throw error;
      }
    },
  });
  // const {
  //   handleSubmit,
  //   handleBlur,
  //   handleChange,
  //   values,
  //   touched,
  //   errors } = formik;

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body row p-5">
              <div>
                <img
                  src={signUp}
                  width={250}
                  height={250}
                  className="rounded-circle"
                  alt={t('SignUp.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('signUp.registration')}</h1>
                <Form.Floating className="form-floating mb-3">
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
                    ref={refInput}
                    isInvalid={
                      (formik.errors.username && formik.touched.username) || authError
                    }
                  />
                  <Form.Label htmlFor="username">
                    {t('signUp.username')}
                  </Form.Label>
                  <Form.Control.Feedback
                    type="invalid"
                    tooltip
                    placement="right"
                  >
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="form-floating mb-3">
                  <Form.Control
                    type="password"
                    placeholder={t('signUp.validSignUp.passwordMin')}
                    name="password"
                    required
                    id="password"
                    autoComplete="new-password"
                    // aria-autocomplete="list"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      (formik.errors.password && formik.touched.password) || authError
                    }
                  />
                  <Form.Label htmlFor="password">
                    {t('signUp.password')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="form-floating mb-3">
                  <Form.Control
                    type="password"
                    placeholder={t('signUp.validSignUp.passwordConfirm')}
                    id="passwordConfirm"
                    name="passwordConfirm"
                    required
                    autoComplete="new-password"
                    value={formik.values.passwordConfirm}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    isInvalid={
                      (formik.errors.passwordConfirm && formik.touched.passwordConfirm) || authError
                    }
                  />
                  <Form.Label htmlFor="passConfirm">
                    {t('signUp.confirmPassword')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.passwordConfirm}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button
                  type="submit"
                  className="w-100"
                  variant="outline-primary"
                >
                  {t('signUp.buttonRegister')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
