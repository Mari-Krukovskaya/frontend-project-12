import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { Login } from "../pages/Login.jsx";
import { NotFound } from "../pages/NotFoundPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;