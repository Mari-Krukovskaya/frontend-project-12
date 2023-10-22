import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useWSocket } from '../../contexts/SocketContext';
import { selectors } from '../../slices/channelsSlice';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const RenameModalChannel = ({ id, show, handleClose }) => {
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
        .notOneOf(namesRenameChannels, 'Channel name must be unique')
        .min(3, 'Channel name must be at least 3 characters')
        .max(20, 'Channel name must not exceed 20 characters')
        .required('Channel name is required'),
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
          toast.success('Channel renamed successfully');
          handleClose();
        } catch (error) {
          toast.error('Failed to rename channel');
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
          <Modal.Title>Rename Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>New Channel Name</Form.Label>
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
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Rename
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
