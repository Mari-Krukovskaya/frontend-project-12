import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { modalsActions } from '../../slices/index.js';
import { useWSocket } from '../../contexts/SocketContext.js';
import { selectors } from '../../slices/channelsSelectors.js';

const isProfanity = (value) => {
  const cleanValue = filter.clean(value);
  return cleanValue !== value;
};

const AddModalChannel = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const { emitAddChannel } = useWSocket();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const channelsNames = channels.map((channelName) => channelName.name);

  const validSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('modal.validChannel.required'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .notOneOf(channelsNames, t('modal.validChannel.uniq'))
      .test(
        'isProfanity',
        t('modal.validChannel.obsceneLexicon'),
        (value) => !isProfanity(value),
      ),
  });

  const handleClose = () => {
    dispatch(modalsActions.isClose());
  };

  useEffect(() => inputRef.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: validSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const filterName = filter.clean(values.name);
      try {
        await emitAddChannel(filterName);
        toast.success(t('toasts.createChannel'));
        handleClose();
      } catch (error) {
        formik.setSubmitting(false);
        toast.error(t('toasts.connectError'));
      }
    },
  });

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              ref={inputRef}
              className="mb-2"
              autoFocus
              isInvalid={!!formik.errors.name}
              disabled={formik.isSubmitting}
            />
            <Form.Label htmlFor="name" visuallyHidden>
              {t('modal.nameChannel')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              type="button"
              onClick={handleClose}
            >
              {t('modal.buttonCancel')}
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              {t('modal.buttonCreate')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModalChannel;
