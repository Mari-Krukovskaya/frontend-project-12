import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useWSocket } from '../contexts/SocketContext.js';
import { AuthContext } from '../contexts/AuthContext.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import {
  selectCurrentChannelId,
  selectCurrentChannel,
} from '../slices/channelsSelectors.js';

const Messages = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const msgRefInput = useRef(null);
  const socket = useWSocket();
  const { user } = useContext(AuthContext);

  const currentId = useSelector(selectCurrentChannelId);
  const currentChannel = useSelector(selectCurrentChannel);
  const messages = useSelector(messagesSelectors.selectAll);

  const filteredMessages = messages.filter(
    (msg) => msg.channelId === currentId.id,
  );

  useEffect(() => {
    refInput.current.focus();
  }, [currentId, filteredMessages]);

  useEffect(() => {
    msgRefInput.current?.scrollIntoView();
  }, [filteredMessages.length]);

  const validSchema = yup.object().shape({
    body: yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: validSchema,
    // validateOnBlur: false,
    onSubmit: async (values) => {
      // eslint-disable-next-line
      //debugger;
      formik.setSubmitting(true);
      const filterBody = filter.clean(values.body);
      const message = {
        body: filterBody,
        channelId: currentId.id,
        username: user.username,
      };
      try {
        await socket.emitNewMessage(message);
        formik.resetForm();
      } catch (error) {
        toast.error(`${t('toasts.connectError')}`);
        formik.setSubmitting(false);
      }
    },
  });
  const isButtonDisable = formik.isSubmitting || formik.values.body.trim() === '';
  return (
      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>{`# ${currentChannel?.name}`}</b>
            </p>
            <span className="text-muted">
              {t('messages.counter.count', { count: filteredMessages.length })}
            </span>
          </div>
          <div id="messages-box" className="chat-messages overflow-auto px-5" ref={msgRefInput}>
            {filteredMessages.map((message) => (
              message.username === user.username ? (
                <div
                  key={message.id}
                  className="text-break mb-2"
                >
                  <b>{message.username}</b>
                  :
                  {' '}
                  {message.body}
                </div>
              ) : (
                <div
                  key={message.id}
                  className="text-break mb-2"
                  ref={msgRefInput}
                >
                  <div className="d-inline-flex bg-body p-2 rounded border">
                    <div>
                      <b>{message.username}</b>
                    </div>
                    :
                    {' '}
                     {message.body}
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="mt-auto px-5 py-3">
            <Form
              onSubmit={formik.handleSubmit}
              noValidate
              className="py-1 border rounded-2"
            >
              <InputGroup className="input-group has-validation">
                <Form.Control
                  type="text"
                  required
                  className="border-0 p-0 ps-2"
                  onChange={formik.handleChange}
                  value={formik.values.body}
                  name="body"
                  aria-label={t('messages.newMessage')}
                  ref={refInput}
                  onBlur={formik.handleBlur}
                  placeholder={t('messages.messagePlaceholder')}
                  autoComplete="off"
                  disabled={formik.isSubmitting}
                />
                <Button
                  type="submit"
                  variant="group-vertical"
                  // disabled={formik.isValidating}
                  disabled={isButtonDisable}
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
              </InputGroup>
            </Form>
          </div>
        </div>
      </div>
  );
};
export default Messages;
