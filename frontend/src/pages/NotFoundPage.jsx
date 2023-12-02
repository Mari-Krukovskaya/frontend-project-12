import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import notFound404 from '../images/notFound404.jpg';
import routes from '../routes';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img
        src={notFound404}
        width={250}
        height={250}
        alt={t('pageNotFound.notFound')}
        className="img-fluid h-20"
      />
      <h1 className="text-muted h4">{t('pageNotFound.notFound')}</h1>
      <p className="text-muted">
        {t('pageNotFound.clickTheLink')}
        <Link to={routes.home()}>{t('pageNotFound.goToHomePage')}</Link>
      </p>
    </div>
  );
};
export default NotFoundPage;
