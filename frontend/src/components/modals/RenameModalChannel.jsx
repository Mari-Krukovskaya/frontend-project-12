/* eslint-disable functional/no-expression-statements */
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useWSocket } from '../../contexts/SocketContext';
import { modalsActions } from '../../slices/index.js';
import { selectors } from '../../slices/channelsSelectors.js';

const RenameModalChannel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { emitRenameChannel } = useWSocket();
  const channels = useSelector(selectors.selectAll);
  const { channelId, show } = useSelector((state) => state.modal);
  const currentChannel = useSelector((state) => selectors.selectById(state, channelId));

  const channelNames = channels.map((channelName) => channelName.name);

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const handleClose = () => dispatch(modalsActions.isClose());

  const validSchema = Yup.object().shape({
    name: Yup.string().trim()
      .required(t('modal.validChannel.required'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .notOneOf(channelNames, t('modal.validChannel.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      name: currentChannel?.name,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const newName = filter.clean(values.name);
      try {
        await emitRenameChannel(channelId, newName);
        formik.resetForm();
        toast.success(t('toasts.renameChanel'));
        handleClose();
      } catch (error) {
        formik.setSubmitting(false);
        toast.error(t('toasts.connectError'));
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Form.Group>
              <Form.Control
                name="name"
                id="name"
                className="mb-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                ref={inputRef}
                isInvalid={formik.errors.name}
              />
              <Form.Label htmlFor="name" visuallyHidden>{t('modal.nameChannel')}</Form.Label>
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.name)}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button className="me-2" variant="secondary" type="button" onClick={handleClose}>
                {t('modal.buttonCancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                {t('modal.buttonCreate')}
              </Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default RenameModalChannel;
