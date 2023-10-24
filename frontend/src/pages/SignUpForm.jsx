import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import api from '../routes/api.js';
import Nav from '../components/NavBar.jsx';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object({
    username: Yup.string()
      .min(3, `${t('SignUp.ValidSignUp.usernameMinMax')}`)
      .max(20, `${t('SignUp.ValidSignUp.usernameMinMax')}`)
      .required(`${t('SignUp.ValidSignUp.required')}`),
    password: Yup.string()
      .min(6, `${t('SignUp.ValidSignUp.passwordMin')}`)
      .required(`${t('SignUp.ValidSignUp.required')}`),
    confirmPassword: Yup.string()
      .required(`${t('SignUp.ValidSignUp.required')}`)
      .oneOf([Yup.ref('password')], `${t('SignUp.ValidSignUp.passwordConfirm')}`),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationShema: validation,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(false);
      try {
        const { username, password } = values;
        const newValues = { username, password };
        const { data } = await axios.post(api.signUpPath(), newValues);
        const { token } = data;
        localStorage.setItem('token', token);
        login(token);
        navigate('/');
      } catch (er) {
        if (er.response && er.response.status === 409) {
          setAuthError(`${t('SignUp.ValidSignUp.alreadyExists')}`);
        }
        setSubmitting(false);
        throw er;
      }
    },
  });
  const { handleSubmit, handleBlur, values, handleChange, touched, errors } = formik;
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
                        src={signUp}
                        width={250}
                        height={250}
                        className="rounded-circle"
                        alt={t('SignUp.registration')}
                      />
                    </div>
                    <Form onSubmit={handleSubmit} className="w-50">
                      <h1 className="text-center mb-4">
                        {t('SignUp.registration')}
                      </h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          id="username"
                          name="username"
                          required
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          ref={refInput}
                          placeholder={t('SignUp.ValidSignUp.usernameMinMax')}
                          isInvalid={
                            (touched.username && !!errors.username) || authError
                          }
                        />
                        <Form.Label htmlFor="username">
                          {t('SignUp.username')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="password"
                          id="password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder={t('SignUp.ValidSignUp.passwordMin')}
                          isInvalid={
                            (touched.password && !!errors.password) || authError
                          }
                        />
                        <Form.Label htmlFor="password">
                          {t('SignUp.password')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="password"
                          id="passwordConfirm"
                          name="passwordConfirm"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          placeholder={t('SignUp.ValidSignUp.passwordConfirm')}
                          isInvalid={
                            (touched.passwordConfirm && !!errors.passwordConfirm) || authError
                          }
                        />
                        <Form.Label htmlFor="passConfirm">
                          {t('SignUp.confirmPassword')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.passwordConfirm}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100 btn btn-outline-primary"
                      >
                        {t('SignUp.buttonRegister')}
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default SignUpForm;
