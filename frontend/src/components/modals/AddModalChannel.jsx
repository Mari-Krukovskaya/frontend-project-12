import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useWSocket } from '../../contexts/SocketContext.jsx';
import { selectors, setCurrentChannelId } from '../../slices/channelsSlice.js';

export const AddModalChannel = ({ show, handleClose }) => {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const wsocket = useWSocket();
    const dispatch = useDispatch();

    const channels = useSelector(selectors.selectAll);
    const namesAllChannels = channels.map((channel) => channel.name);

    const validationSchema = Yup.object({
      name: Yup.string()
        .notOneOf(namesAllChannels, t('modal.validChannel.uniq'))
        .min(3, t('modal.validChannel.nameMinMax'))
        .max(20, t('modal.validChannel.nameMinMax'))
        .required(t('modal.validChannel.uniq')),
    });
  
    const formik = useFormik({
      initialValues: {
        name: '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const { name } = values;
        formik.setSubmitting(true);
        const filterName = filter.clean(name)
        try {
         const data = await wsocket.emitAddChannel(filterName);
          await dispatch(setCurrentChannelId(data))
          name.trim()
          handleClose();
          toast.success(t('toasts.createChannel'));
        } catch (error) {
          toast.error(t('toasts.errorChannel'));
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
      <>
      <button onClick={handleClose} className="btn btn-primary" type="button">{t('modal.buttonAdd')}</button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.addModalChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>{t('modal.nameChannel')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                ref={inputRef}
                isInvalid={touched.name && errors.name}
                autoFocus
              />
              <Form.Control.Feedback type="invalid" >
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