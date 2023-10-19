import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import api from '../routes/api';
import entry from '../images/entry.jpg';

const Login = () => {
  const { login } = useContext(AuthContext);
  //   const [error, setError] = useState('');

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const handleSubmit = async (values) => {
    try {
      const { data } = await axios.post(api.loginPath(), values);
      const { token } = data;
      localStorage.setItem('token', token);
      login(token);
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <nav className="shadow-sm navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={entry} width={250} height={250} className="rounded-circle" alt="Войти" />
                    </div>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {() => (
                        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                          <h1 className="text-center mb-4">Войти</h1>
                          <div className="form-floating mb-3">
                            <Field
                              type="text"
                              id="username"
                              name="username"
                              placeholder="Ваш ник"
                              className="form-control"
                            />
                            <label htmlFor="username">Ваш Ник</label>
                          </div>
                          <div className="form-floating mb-4">
                            <Field
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Пароль"
                              className="form-control"
                            />
                            <label className="form-label" htmlFor="password">Пароль</label>
                          </div>
                          <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                        </Form>
                      )}
                    </Formik>
                    <div className="card-footer p-4">
                      <div className="text-center">
                        <span>Нет аккаунта?</span>
                        <Link to="/login">Регистрация</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
