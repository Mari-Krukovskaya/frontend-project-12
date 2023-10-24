import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useWSocket } from '../../contexts/SocketContext.jsx';
import { selectors } from '../../slices/channelsSlice';

export const AddModalChannel = ({ show, handleClose }) => {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const wsocket = useWSocket();

    const channels = useSelector(selectors.selectAll);
    const namesAllChannels = channels.map((channel) => channel.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

    const validationSchema = Yup.object({
      name: Yup.string()
        .notOneOf(namesAllChannels, `${t('Modal.validChannel.uniq')}`)
        .min(3, `${t('Modal.validChannel.nameMinMax')}`)
        .max(20, `${t('Modal.validChannel.nameMinMax')}`)
        .required(`${t('Modal.validChannel.uniq')}`),
    });
  
    const formik = useFormik({
      initialValues: {
        name: '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          await wsocket.emitAddChannel(values.name);
          toast.success('Канал успешно создан');
          handleClose();
        } catch (error) {
          toast.error('Не удалось создать канал');
          console.error(error);
        }
      },
    });
  
    const {
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
          <Modal.Title>{t('Modal.addModalChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>{t('Modal.nameChannel')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
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