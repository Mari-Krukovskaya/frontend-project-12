import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
        <div className="h-100">
            <div className="h-100" id="chat">
                <div className="d-flex flex-column h-100">
                    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                        <div className="container">
                          <Link to="/">Hexlet Chat</Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
  );
};
export default HomePage;
