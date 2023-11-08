import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useWSocket } from '../../contexts/SocketContext';
import { setCurrentChannelId } from '../../slices/channelsSlice.js';
import { isClose } from '../../slices/modalSlice.js';
import notify from '../notify.js';

const RemoveModalChannel = () => {
  const { t } = useTranslation();
  const wsocket = useWSocket();
  const dispatch = useDispatch();
  const { show, channelId } = useSelector((state) => state.modal);
  const defaultChannel = 1;

  const handleDeleteClick = async (id) => {
    try {
      await wsocket.emitRemoveChannel({ id });
      toast.success(t('toasts.removeChannel'), notify);
      dispatch(setCurrentChannelId(defaultChannel));
    } catch (error) {
      toast.error(t('toasts.errorChannel'), notify);
      console.error(error);
    }
  };

  const handleClose = () => dispatch(isClose({ type: 'delete', channelId }));

  return (
    <Modal onHide={handleClose} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.areYouSure')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.buttonCancel')}
        </Button>
        <Button variant="primary" onClick={() => handleDeleteClick(channelId)}>
          {t('modal.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RemoveModalChannel;
