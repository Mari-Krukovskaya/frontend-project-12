import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Nav from '../components/NavBar.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object({
    username: Yup.string()
      .min(3, t('signUp.validSignUp.usernameMinMax'))
      .max(20, t('signUp.validSignUp.usernameMinMax'))
      .required(t('signUp.validSignUp.required')),
    password: Yup.string()
      .min(6, t('signUp.validSignUp.passwordMin'))
      .required(t('signUp.validSignUp.required')),
    confirmPassword: Yup.string()
      .required(t('signUp.validSignUp.required'))
      .oneOf([Yup.ref('password')], t('signUp.validSignUp.passwordConfirm')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationShema: validation,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(false);
      try {
        const { username, password } = values;
        const newValues = { username, password };
        const { data } = await axios.post(api.signUpPath(), newValues);
        localStorage.setItem('username', JSON.stringify(data));
        login();
        navigate(api.home());
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
      <div className="h-100 d-flex flex-column">
        <Nav />
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
                  <Form noValidate onSubmit={handleSubmit} className="w-50">
                    <h1 className="text-center mb-4">
                      {t('signUp.registration')}
                    </h1>
                    <Form.Floating className="form-floating mb-3">
                      <Form.Control
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={refInput}
                        placeholder={t('signUp.validSignUp.usernameMinMax')}
                        isInvalid={
                          (touched.username && errors.username) || authError
                        }
                      />
                      <Form.Label htmlFor="username">
                        {t('signUp.username')}
                      </Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="form-floating mb-3">
                      <Form.Control
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder={t('signUp.validSignUp.passwordMin')}
                        isInvalid={
                          (touched.password && errors.password) || authError
                        }
                      />
                      <Form.Label htmlFor="password">
                        {t('signUp.password')}
                      </Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="form-floating mb-3">
                      <Form.Control
                        type="password"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        placeholder={t('signUp.validSignUp.passwordConfirm')}
                        isInvalid={
                          (touched.passwordConfirm && errors.passwordConfirm) || authError
                        }
                      />
                      <Form.Label htmlFor="passConfirm">
                        {t('signUp.confirmPassword')}
                      </Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {authError === false
                          ? errors.passwordConfirm
                          : t('signUp.validSignUp.passwordConfirm')}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Button
                      type="submit"
                      className="w-100 btn btn-outline-primary"
                    >
                      {t('signUp.buttonRegister')}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignUpForm;
