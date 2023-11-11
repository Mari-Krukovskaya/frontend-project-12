import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import filter from 'leo-profanity';
import cn from 'classnames';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useWSocket } from '../contexts/SocketContext.js';
import { AuthContext } from '../contexts/AuthContext.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { selectCurrentChannelId, selectCurrentId } from '../slices/channelsSelectors.js';

const Messages = () => {
  const { t } = useTranslation();
  const refInput = useRef(null);
  const msgRefInput = useRef(null);
  const socket = useWSocket();
  const { user } = useContext(AuthContext);
  const currentChannelName = useSelector(selectCurrentChannelId);
  const currentId = useSelector(selectCurrentId);
  const messages = useSelector(messagesSelectors.selectAll);
  // eslint-disable-next-line
  // debugger
  const filteredMessages = messages.filter((msg) => msg.channelId === currentId);
  const validSchema = yup.object().shape({
    body: yup.string().trim().required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: validSchema,
    validateOnBlur: false,
    onSubmit: async ({ body }) => {
      // eslint-disable-next-line
      // debugger
      formik.setSubmitting(true);
      const filterBody = filter.clean(body);
      // console.log(filterBody, 'body');
      try {
        await socket.emitNewMessage({
          body: filterBody,
          channelId: currentId,
          username: user.username,
        });
        formik.resetForm();
      } catch (error) {
        formik.setSubmitting(false);
        toast.error(`${t('toasts.connectError')}`);
      }
    },
  });
  useEffect(
    () => refInput.current.focus(),
    [currentChannelName, filteredMessages],
  );

  useEffect(() => {
    msgRefInput.current.scrollTop = msgRefInput.current.scrollHeight;
  }, [filteredMessages.length]);

  const isButtonDisable = formik.isSubmitting || formik.values.body.trim() === '';
  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              {currentChannelName && `# ${currentChannelName}`}
            </b>
          </p>
          <span className="text-muted">
            {t('messages.counter.count', { count: filteredMessages.length })}
          </span>
        </div>
        <div
          ref={msgRefInput}
          id="messages-box"
          className="chat-messages overflow-auto px-5 "
        >
          {filteredMessages.map(({ id, username, body }) => {
            return (
              <div key={id} className="text-break mb-2">
                <b>{username}</b>
                {`: ${body}`}
              </div>
            );
          })}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form
            onSubmit={formik.handleSubmit}
            noValidate
            className="py-1 border rounded-2"
          >
            <InputGroup className={cn({ 'has-validation': isButtonDisable })}>
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
              />
              <Button type="submit" variant="group-vertical" disabled={isButtonDisable}>
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
