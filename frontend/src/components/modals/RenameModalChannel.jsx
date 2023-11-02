import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useWSocket } from '../../contexts/SocketContext';
import { selectorsChannels } from '../../slices/channelsSlice.js';
import notify from '../notify.js';
import { isClose } from '../../slices/modalSlice.js';

const RenameModalChannel = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const { show, channelId } = useSelector((state) => state.modal);
  const channels = useSelector(selectorsChannels.selectAll);
  const channelsName = channels.map((channel) => channel.name);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.select();
    }, 0);
  }, []);

  const handleClose = () => dispatch(isClose());

  const validSchema = Yup.object({
    name: Yup.string()
      .notOneOf(channelsName, t('modal.validChannel.uniq'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .required(t('modal.validChannel.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      name: channelId.name || '',
    },
    validationSchema: validSchema,
    onSubmit: async ({ name }) => {
      formik.setSubmitting(true);
      const newName = filter.clean(name);
      try {
        await wsocket.emitRenameChannel(channelId.id, newName);
        handleClose();
        toast.success(t('toasts.renameChanel'), notify);
      } catch (error) {
        toast.error(t('toasts.errorChannel'), notify);
        formik.setSubmitting(false);
        console.error(error);
      }
    },
  });
  const {
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
  } = formik;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameMOdalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>{t('modal.renameModalChannel')}</Form.Label>
            <Form.Control
              className="mb-2"
              type="text"
              name="name"
              required
              disabled={isSubmitting}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              ref={inputRef}
              isInvalid={touched.name && errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name && touched.name ? errors.name : null}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('modal.buttonCancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('modal.buttonCreate')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default RenameModalChannel;
