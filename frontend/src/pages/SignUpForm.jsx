import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import api from '../routes/api.js';
import signUp from '../images/signUp.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SignUpForm = () => {
  const { login } = useContext(AuthContext);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const validation = Yup.object({
    username: Yup.string()
      .min(3, 'не менее 3')
      .max(20, 'не больше 20')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .required('Обязательное поле')
      .oneOf([Yup.ref('password')], 'пароли должны совпадать'),
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
        const { token } = data;
        localStorage.setItem('token', token);
        login(token);
        navigate('/');
      } catch (er) {
        if (er.response && er.response.status === 409) {
          setAuthError('такой пользователь уже существует');
        }
        setSubmitting(false);
        throw er;
      }
    },
  });
  const { handleSubmit, values, handleChange, touched, errors } = formik;
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <nav className="shadow-sm navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Chat
              </a>
            </div>
          </nav>
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
                        alt="Регистрация"
                      />
                    </div>
                    <Form onSubmit={handleSubmit} className="w-50">
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          id="username"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          placeholder="От 3 до 20 символов"
                          isInvalid={
                            (touched.username && !!errors.username) || authError
                          }
                        />
                        <Form.Label htmlFor="username">
                          Имя пользователя
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
                          placeholder="Не менее 6 символов"
                          isInvalid={
                            (touched.password && !!errors.password) || authError
                          }
                        />
                        <Form.Label htmlFor="password">Пароль</Form.Label>
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
                          placeholder="пароли должны совпадать"
                          isInvalid={
                            (touched.passwordConfirm && !!errors.passwordConfirm) || authError
                        }
                        />
                        <Form.Label htmlFor="passConfirm">password</Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.passwordConfirm}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100 btn btn-outline-primary"
                      >
                        Зарегистрироваться
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
