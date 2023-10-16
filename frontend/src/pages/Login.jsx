import React from "react";
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { userTranslation } from 'react-i18next';

 export const Login = () => {

    const initialValues = {
        username: '',
        password: '',
    };

    const validationSchema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required()
    });

    const handleSubmit = (values) => {
        console.log(values)
    };

    return (
        <>
            <Formik
                initialValues={{ initialValues }}
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
                                value
                            />
                            <label htmlFor="username">Ваш Ник</label>
                        </div>
                        <div className="form-floating mb-4">
                            <Field
                                type="password"
                                id="password"
                                nmae="password"
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
                    <a href="/signup">Регистрация</a>
                </div>
            </div>
        </>

    )
};