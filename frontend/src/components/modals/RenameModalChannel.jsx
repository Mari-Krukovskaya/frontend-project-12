import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import cn from 'classnames';
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
  const channelNames = channels.map((channelName) => channelName.name);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.select();
      inputRef.current.select();
    }, 0);
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
      try {
        await wsocket.emitRenameChannel(channel.id, newName);
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

  const newClass = cn('mb-2', 'form-control', {
    'is-invalid': errors.name && touched.name,
  });

  return (
    <>
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
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              ref={inputRef}
              className={newClass}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name && touched.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              {t('modal.buttonCancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {t('modal.buttonCreate')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </>
  );
};
export default RenameModalChannel;
