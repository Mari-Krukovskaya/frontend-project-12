import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nav from '../components/NavBar.jsx';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Nav />
          <Link to="/login">{t('Nav.chat')}</Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
