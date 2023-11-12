import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import store from '../../slices/store.js';
import notify from '../notify.js';
import { modalsActions } from '../../slices/index.js';
import { useWSocket } from '../../contexts/SocketContext.js';
import { selectors } from '../../slices/channelsSelectors.js';
import { AuthContext } from '../../contexts/AuthContext.js';
import { actions as channelsActions } from '../../slices/channelsSlice.js';

const isProfanity = (value) => {
  const cleanValue = filter.clean(value);
  return cleanValue !== value;
};

const AddModalChannel = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const channels = useSelector(selectors.selectAll);
  const { show } = useSelector((state) => state.modal);
  const namesAllChannels = channels.map((channel) => channel.name);

  const validSchema = yup.object({
    name: yup
      .string()
      .notOneOf(namesAllChannels, t('modal.validChannel.uniq'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .test(
        'isProfanity',
        t('modal.validChannel.obsceneLexicon'),
        (value) => !isProfanity(value),
      )
      .required(t('modal.validChannel.uniq')),
  });
  const handleClose = () => {
    dispatch(modalsActions.isClose({ type: null, channelId: null }));
  };

  useEffect(() => inputRef.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: validSchema,
    onSubmit: async ({ name }) => {
      formik.setSubmitting(true);
      const filterName = filter.clean(name);
      try {
        const data = await wsocket.emitAddChannel(filterName, user);
        store.dispatch(channelsActions.setCurrentChannelId(data.id));
        handleClose();
        toast.success(t('toasts.createChannel', notify));
      } catch (error) {
        formik.setSubmitting(false);
        toast.error(t('toasts.connectError', notify));
      }
    },
  });
  const {
    handleSubmit,
    isSubmitting,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  } = formik;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              type="text"
              name="name"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              ref={inputRef}
              className="mb-2"
              disabled={isSubmitting}
              isInvalid={errors.name && touched.name}
            />
            <Form.Label>{t('modal.nameChannel')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('modal.buttonCancel')}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {t('modal.buttonCreate')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModalChannel;
