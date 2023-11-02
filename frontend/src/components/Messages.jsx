import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useWSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { selectors } from '../slices/messagesSlice.js';
import { selectorsChannels } from '../slices/channelsSlice';

const Messages = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);
  const refInput = useRef(null);
  const { emitNewMessage } = useWSocket();

  const channels = useSelector(selectorsChannels.selectAll);
  const { currentChannelId } = useSelector((state) => state.channels);
  const currentChannel = channels.find((channel) => currentChannelId === channel.id);
  const currentChannelName = currentChannel ? currentChannel.name : null;
  const selectMessages = useSelector(selectors.selectAll);
  const messages = selectMessages.filter((msg) => msg.channelId === currentChannelId);
  useEffect(() => {
    refInput.current.focus();
  }, [currentChannelId, selectMessages]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: ({ body }) => {
      const filterBody = filter.clean(body);
      emitNewMessage({
        body: filterBody,
        channelId: currentChannelId,
        username: currentUser,
      });
      formik.setFieldValue('body', '');
    },
  });
  const { handleSubmit, handleChange, handleBlur, isSubmitting, values } = formik;
  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              {' #'}
              {currentChannelName}
            </b>
          </p>
          <span className="text-muted">
            {t('messages.counter.count', { count: messages.length })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages.map((msg) => (
            <div key={msg.id} className="text-break mb-2">
              <b>{msg.username}</b>
              {`: ${msg.body}`}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form
            onSubmit={handleSubmit}
            noValidate
            className="py-1 border rounded-2"
          >
            <Form.Group className="input-group has-validation">
              <Form.Control
                className="border-0 p-0 ps-2"
                onChange={handleChange}
                value={values.body}
                name="body"
                aria-label={t('messages.newMessage')}
                ref={refInput}
                onBlur={handleBlur}
                placeholder={t('messages.messagePlaceholder')}
              />
              <Button
                type="submit"
                variant="group-vertical"
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">
                  {t('messages.enterMessage')}
                </span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
