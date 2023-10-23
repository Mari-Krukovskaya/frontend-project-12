import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import notFound404 from '../images/notFound404.jpg';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img
        src={notFound404}
        width={250}
        height={250}
        alt={t('PageNotFound.notFound')}
        className="img-fluid h-20"
      />
      <h1 className="text-muted h4">{t('PageNotFound.notFound')}</h1>
      <p className="text-muted">
        {t('PageNotFound.clickTheLink')}
        <Link to="/">{t('PageNotFound.goToHomePage')}</Link>
      </p>
    </div>
  );
};
export default NotFoundPage;
