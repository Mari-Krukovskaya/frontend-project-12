import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from '../components/NavBar.jsx';
import api from '../routes/api.js';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Nav />
          <Link to={api.login()}>{t('nav.chat')}</Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
