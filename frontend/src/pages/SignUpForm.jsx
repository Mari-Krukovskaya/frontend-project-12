import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import * as yup from 'yup';
import { Form, FormGroup, Button, Card, Image } from 'react-bootstrap';
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
  const refInput = useRef(null);
  const navigate = useNavigate();

  // // eslint-disable-next-line
  // debugger;
  // const validSchema = yup.object().shape({
  //   username: yup.string()
  //     .min(3, t('signUp.validSignUp.usernameMinMax'))
  //     .max(20, t('signUp.validSignUp.usernameMinMax'))
  //     .required(t('signUp.validSignUp.required')),
  //   password: yup.string()
  //     .min(6, t('signUp.validSignUp.passwordMin'))
  //     .required(t('signUp.validSignUp.required')),
  //   confirmPassword: yup.string()
  //     .required(t('signUp.validSignUp.required'))
  //     .oneOf(
  //       [yup.ref('password')],
  //       t('signUp.validSignUp.passwordConfirm'),
  //     ),
  // });
  // eslint-disable-next-line
  // debugger;
  useEffect(() => refInput.current.focus(), []);

  const formik = useFormik({
    // validationSchema: validSchema,
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async (values) => {
      try {
        setAuthError(false);
        // eslint-disable-next-line
        // debugger;
        const response = await axios.post(api.signUpPath(), {
          username: values.username,
          password: values.password,
        });
        auth.login(response.data);
        // eslint-disable-next-line
        // debugger;
        navigate(api.home());
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
          setAuthError(t('signUp.validSignUp.alreadyExists'));
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
                  alt={t('SignUp.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50" noValidate>
                <h1 className="text-center mb-4">{t('signUp.registration')}</h1>
                <fieldset>
                  <FormGroup
                    controlId="username"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="username"
                      name="username"
                      required
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      ref={refInput}
                      isInvalid={isInvalidUsername || authError}
                    />
                    <Form.Label>{t('signUp.username')}</Form.Label>
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                      placement="right"
                    >
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup
                    controlId="password"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder="password"
                      name="password"
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
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup
                    controlId="passwordConfirm"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder="passwordConfirm"
                      name="passwordConfirm"
                      required
                      autoComplete="new-password"
                      value={formik.values.passwordConfirm}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={isInvalidPassConfirm || authError}
                    />
                    <Form.Label>{t('signUp.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.passwordConfirm || authError}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <Button
                    type="submit"
                    className="w-100"
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
