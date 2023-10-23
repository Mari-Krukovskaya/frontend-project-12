import React from 'react';
import { Link } from 'react-router-dom';
import notFound404 from '../images/notFound404.jpg';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <img
        src={notFound404}
        width={250}
        height={250}
        alt="страница не найдена"
        className="img-fluid h-20"
      />
      <h1 className="text-muted h4">страница не найдена</h1>
      <p className="text-muted">
        но вы можете
        <Link to="/">На главную страницу</Link>
      </p>
    </div>
  );
};
export default NotFoundPage;
