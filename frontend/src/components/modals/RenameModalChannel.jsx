// import 'react-toastify/dist/ReactToastify.css';
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
  const inputRef = useRef(null);
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { channelId } = useSelector((state) => state.modal);
  const currentChannel = useSelector((state) => selectors.selectById(state, channelId));

  const channelNames = channels.map((channelName) => channelName.name);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const handleClose = () => dispatch(modalsActions.isClose());

  const validSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .notOneOf(channelNames, t('modal.validChannel.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      name: currentChannel?.name,
    },
    validationSchema: validSchema,
    onSubmit: async (values) => {
      // eslint-disable-next-line
      // debugger;
      formik.setSubmitting(true);
      const newName = filter.clean(values.name);
      try {
        await wsocket.emitRenameChannel(channelId, newName);
        formik.resetForm();
        toast.success(t('toasts.renameChanel'));
        handleClose();
      } catch (error) {
        // eslint-disable-next-line
        debugger;
        formik.setSubmitting(false);
        toast.error(t('toasts.connectError'));
      }
    },
  });

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              type="text"
              id="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              ref={inputRef}
              className="mb-2"
              isInvalid={!!formik.errors.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('modal.renameModalChannel')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
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
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default RenameModalChannel;
