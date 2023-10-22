import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useWSocket } from '../../contexts/SocketContext.jsx';
import { selectors } from '../../slices/channelsSlice';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const AddModalChannel = ({ show, handleClose }) => {
    const inputRef = useRef(null);
    const wsocket = useWSocket();

    const channels = useSelector(selectors.selectAll);
    const namesAllChannels = channels.map((channel) => channel.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

    const validationSchema = Yup.object({
      name: Yup.string()
        .notOneOf(namesAllChannels, 'Channel name must be unique')
        .min(3, 'Channel name must be at least 3 characters')
        .max(20, 'Channel name must not exceed 20 characters')
        .required('Channel name is required'),
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
          <Modal.Title>Add Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Channel Name</Form.Label>
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
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };