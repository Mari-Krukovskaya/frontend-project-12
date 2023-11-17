import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import ShowModal from '../components/modals/index.jsx';
import { messagesActions, channelsActions } from '../slices/index.js';
import { AuthContext } from '../contexts/AuthContext.js';
import api from '../routes/api.js';

const getAuthHeader = (data) => {
  if (data && data.token) {
    return { Authorization: `Bearer ${data.token}` };
  }
  return {};
};

const HomePage = () => {
  const [isSpinner, setIsSpinner] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { logout, user } = useContext(AuthContext);

  // eslint-disable-next-line
  // debugger;
  useEffect(() => {
    const fetchData = async () => {
      setIsSpinner(true);
      if (!user) {
        navigate(api.login(), { replace: false });
        return;
      }
      try {
        const userData = {
          headers: getAuthHeader(user),
        };
        const {
          data: { channels, messages },
        } = await axios.get(api.dataPath(), userData);
        setIsSpinner(false);
        // eslint-disable-next-line
        //debugger;
        dispatch(channelsActions.addManyChannels(channels));
        dispatch(messagesActions.addManyMessages(messages));
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
  }, [dispatch, logout, user, navigate, t]);

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
