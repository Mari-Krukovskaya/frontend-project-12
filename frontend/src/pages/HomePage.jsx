import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar />
          <Link to="/">{t('Nav.chat')}</Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
