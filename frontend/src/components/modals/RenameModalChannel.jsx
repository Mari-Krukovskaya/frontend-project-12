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
import notify from '../notify.js';
import { modalsActions } from '../../slices/index.js';
import { selectors } from '../../slices/channelsSelectors.js';

const RenameModalChannel = ({ channel }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { show, channelId } = useSelector((state) => state.modal);
  const channelNames = channels.map((channelName) => channelName.name);

  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);

  const handleClose = () => dispatch(modalsActions.isClose());

  const validSchema = Yup.object({
    name: Yup.string()
      .notOneOf(channelNames, t('modal.validChannel.uniq'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .required(t('modal.validChannel.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: validSchema,
    onSubmit: async ({ name }) => {
      formik.setSubmitting(true);
      const newName = filter.clean(name);
      const data = { name: newName, id: channelId };
      try {
        await wsocket.emitRenameChannel(data);
        formik.resetForm();
        toast.success(t('toasts.renameChanel'), notify);
        handleClose();
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameMOdalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>{t('modal.renameModalChannel')}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              required
              disabled={isSubmitting}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              ref={inputRef}
              className="mb-2"
              isInvalid={errors.name && touched.name}
            />
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
export default RenameModalChannel;
