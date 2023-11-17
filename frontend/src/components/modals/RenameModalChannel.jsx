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
import { modalsActions } from '../../slices/index.js';
import {
  selectors,
  // selectCurrentChannel,
} from '../../slices/channelsSelectors.js';

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
      .required(t('modal.validChannel.required'))
      .min(3, t('modal.validChannel.nameMinMax'))
      .max(20, t('modal.validChannel.nameMinMax'))
      .notOneOf(channelNames, t('modal.validChannel.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      name: currentChannel?.name,
    },
    validationSchema: validSchema,
    onSubmit: async ({ name }) => {
      // formik.setSubmitting(true);
      const newName = filter.clean(name);
      const data = {
        id: currentChannel.id,
        name: newName,
        removable: currentChannel.removable,
      };
      try {
        await wsocket.emitRenameChannel(data);
        formik.resetForm();
        handleClose();
        toast.success(t('toasts.renameChanel'));
      } catch (error) {
        // eslint-disable-next-line
        debugger;
        formik.setSubmitting(false);

        if (error.isAxiosError && error.response.status === 401) {
          inputRef.current.select();
          return;
        }
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
            <Form.Label>{t('modal.renameModalChannel')}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              required
              disabled={formik.isSubmitting}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              ref={inputRef}
              className="mb-2"
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('modal.buttonCancel')}
            </Button>
            <Button variant="primary" onClick={formik.handleSubmit}>
              {t('modal.buttonCreate')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default RenameModalChannel;
