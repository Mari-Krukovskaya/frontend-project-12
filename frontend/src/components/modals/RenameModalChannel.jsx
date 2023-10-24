import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useWSocket } from '../../contexts/SocketContext';
import { selectors } from '../../slices/channelsSlice';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const RenameModalChannel = ({ id, show, handleClose }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const wsocket = useWSocket();

  const channels = useSelector(selectors.selectAll);
  const channelForRename = channels.filter((channel) => channel.id === id);
  const namesRenameChannels = channels.map((channel) => channel.name);
  
    useEffect(() => {
      setTimeout(() => {
            inputRef.current.select();
      }, 0)
    }, []);

    const validationSchema = Yup.object({
      name: Yup.string()
        .notOneOf(namesRenameChannels, `${t('Modal.validChannel.uniq')}`)
        .min(3, `${t('Modal.validChannel.nameMinMax')}`)
        .max(20, `${t('Modal.validChannel.nameMinMax')}`)
        .required(`${t('Modal.validChannel.uniq')}`),
    });
  
    const formik = useFormik({
      initialValues: {
        name: channelForRename ? channelForRename.name : '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          values.id = id;
          await wsocket.emitRenameChannel(values.name);
          formik.values.name = '';
          toast.success(t('toasts.renameChanel'));
          handleClose();
        } catch (error) {
          toast.error(t('toasts.errorChannel'));
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
          <Modal.Title>{t('Modal.renameMOdalChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>{t('Modal.renameModalChannel')}</Form.Label>
              <Form.Control
              className='mb-2'
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
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('Modal.buttonCancel')}
              </Button>
              <Button variant="primary" type="submit">
                {t('Modal.buttonCreate')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
