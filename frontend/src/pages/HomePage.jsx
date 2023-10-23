import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const HomePage = () => {
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar />
          <Link to="/">Hexlet Chat</Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
