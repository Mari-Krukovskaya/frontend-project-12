import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row } from 'react-bootstrap';

import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import ModalWindow from '../components/modals/index.jsx';
import { addManyChannels, selectorsChannels } from '../slices/channelsSlice.js';
import { addManyMessages } from '../slices/messagesSlice.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../routes/api.js';
import getData from '../apiData/getChatData.js';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, logout } = useContext(AuthContext);
  const channels = useSelector(selectorsChannels.selectAll);
  // const { type, show } = useSelector((state) => state.modal);

  useEffect(() => {
    const fetchData = () => {
      if (!token) {
        navigate(api.login(), { replace: false });
        return;
      }
      try {
        const data = getData(token);
        dispatch(addManyChannels(data.channels));
        dispatch(addManyMessages(data.messages));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
          navigate(api.login(), { replace: false });
        }
      }
    };
    fetchData();
  }, [navigate, dispatch, channels.currentChannelId, token, logout]);

  return (
    <Container className="container h-100 my-4 overflow-hidden rounded shadow">
      <Row className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </Row>
      <ModalWindow />
    </Container>
  );
};
export default HomePage;
