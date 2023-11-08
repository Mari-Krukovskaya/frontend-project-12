import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import ModalWindow from '../components/modals/index.jsx';
import { addManyChannels } from '../slices/channelsSlice.js';
import { addManyMessages } from '../slices/messagesSlice.js';
import { AuthContext } from '../contexts/AuthContext.js';
import api from '../routes/api.js';
import getData from '../apiData/getChatData.js';
import { isOpen } from '../slices/modalSlice.js';

const HomePage = () => {
  const [isSpinner, setIsSpinner] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, token, getAuthHeader } = useContext(AuthContext);

  const handleAddChannel = () => {
    dispatch(isOpen({ type: 'adding' }));
  };

  useEffect(() => {
    setIsSpinner(true);
    if (!token) {
      navigate(api.login(), { replace: false });
      return;
    }
    try {
      const data = getData(getAuthHeader(token));
      setIsSpinner(false);
      dispatch(addManyChannels(data.channels));
      dispatch(addManyMessages(data.messages));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
        navigate(api.login(), { replace: false });
      }
    }
  }, [navigate, dispatch, token, logout, getAuthHeader]);

  return (
    <Container className="container h-100 my-4 overflow-hidden rounded shadow">
      <ModalWindow />
      <Row className="row h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('modal.nameChannel')}</b>
            <Button
              variant="light"
              onClick={handleAddChannel}
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
                style={{ '--darkreader-inline-fill': 'currentColor' }}
                data-darkreader-inline-fill=""
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <Channels />
        </Col>
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
