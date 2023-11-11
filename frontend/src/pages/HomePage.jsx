import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import ShowModal from '../components/modals/index.jsx';
import { messagesActions, channelsActions } from '../slices/index.js';
import { AuthContext } from '../contexts/AuthContext.js';
import api from '../routes/api.js';
import getData from '../apiData/getChatData.js';
import store from '../slices/store.js';

const getAuthHeader = (data) => {
  if (data && data.token) {
    return { Authorization: `Bearer ${data.token}` };
  }
  return {};
};

const HomePage = () => {
  const [isSpinner, setIsSpinner] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsSpinner(true);
      if (!user) {
        navigate(api.login(), { replace: false });
        return;
      }
      try {
        const data = await getData(getAuthHeader(user));
        setIsSpinner(false);
        store.dispatch(channelsActions.addManyChannels(data.channels));
        store.dispatch(channelsActions.setCurrentChannelId(data.selectCurrentChannelId));
        store.dispatch(messagesActions.addManyMessages(data.messages));
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          logout();
          navigate(api.login(), { replace: false });
        }
        console.log(error);
        toast.error(t('toasts.connectError'));
      }
    };
    fetchData();
  }, [logout, navigate, t, user]);

  return (
    <Container className="container h-100 my-4 overflow-hidden rounded shadow">
      <ShowModal />
      <Row className="row h-100 bg-white flex-md-row">
        <Channels />
        <Col className="p-0">
          {isSpinner ? (
            <div className="text-center">
              <Spinner animation="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Messages />
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default HomePage;
