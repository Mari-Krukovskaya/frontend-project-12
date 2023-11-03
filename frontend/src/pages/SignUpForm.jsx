import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button, Card, Image, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const auth = useContext(AuthContext);
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
      .oneOf(
        [Yup.ref('password'), null],
        t('signUp.validSignUp.passwordConfirm'),
      ),
  });
  useEffect(() => refInput.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: validation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setAuthError(false);
      try {
        const response = await axios.post(api.signUpPath(), {
          username: values.username,
          password: values.password,
        });
        console.debug(response.data, 'DATA');
        auth.login(response.data);
        navigate(api.home());
      } catch (error) {
        formik.setSubmitting(false);

        if (error.response && error.response.status === 409) {
          setAuthError(true);
          refInput.current.select();
          return;
        }
        toast.error(`${t('toasts.connectError')}`);
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
  const isDisabled = formik.isSubmitting;

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body row p-5">
              <div>
                <Image
                  src={signUp}
                  width={250}
                  height={250}
                  roundedCircle
                  alt={t('SignUp.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('signUp.registration')}</h1>
                <fieldset disabled={isDisabled}>
                  <FormGroup
                    controlId="username"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder={t('signUp.validSignUp.usernameMinMax')}
                      name="username"
                      required
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      ref={refInput}
                      isInvalid={
                        (formik.touched.username && !!formik.errors.username)
                      }
                    />
                    <Form.Label>{t('signUp.username')}</Form.Label>
                    <Form.Control.Feedback
                      type="invalid"
                      tooltip
                      placement="right"
                    >
                      {t(formik.errors.username)}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup
                    controlId="password"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder={t('signUp.validSignUp.passwordMin')}
                      name="password"
                      required
                      autoComplete="new-password"
                      aria-describedby="passwordHelpBlock"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                       (formik.touched.password && !!formik.errors.password)
                      }
                    />
                    <Form.Label>{t('signUp.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup
                    controlId="passwordConfirm"
                    className="form-floating mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder={t('signUp.validSignUp.passwordConfirm')}
                      name="passwordConfirm"
                      required
                      autoComplete="new-password"
                      value={formik.values.passwordConfirm}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={
                      (formik.touched.passwordConfirm && !!formik.errors.passwordConfirm)
                      }
                    />
                    <Form.Label>{t('signUp.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {authError || t(formik.errors.passwordConfirm)}
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
