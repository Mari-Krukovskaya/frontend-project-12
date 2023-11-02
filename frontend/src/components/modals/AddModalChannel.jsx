import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import notify from '../notify.js';
import { isClose } from '../../slices/modalSlice.js';
import { useWSocket } from '../../contexts/SocketContext.jsx';
import {
  selectorsChannels,
  setCurrentChannelId,
} from '../../slices/channelsSlice.js';

const isProfanity = (value) => {
  const cleanValue = filter.clean(value);
  return cleanValue !== value;
};

const AddModalChannel = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.modal);
  const channels = useSelector(selectorsChannels.selectAll);
  const namesAllChannels = channels.map((channel) => channel.name);

  const validSchema = Yup.object({
    name: Yup.string()
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
  const handleClose = () => dispatch(isClose());

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
        const data = await wsocket.emitAddChannel(filterName);
        dispatch(setCurrentChannelId(data));
        handleClose();
        toast(t('toasts.createChannel'), notify);
      } catch (error) {
        toast(t('toasts.errorChannel'), notify);
        console.error(error);
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } = formik;

  return (
    <>
      <Button onClick={handleClose} className="btn btn-primary" type="button">
        {t('modal.buttonAdd')}
      </Button>
      <Modal show={show} onHide={handleClose}>
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
                isInvalid={
                  touched.name && (errors.name || isProfanity(values.name))
                }
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
              <Button
                variant="primary"
                type="submit"
                disabled={Object.keys(errors).length > 0}
              >
                {t('modal.buttonCreate')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddModalChannel;
