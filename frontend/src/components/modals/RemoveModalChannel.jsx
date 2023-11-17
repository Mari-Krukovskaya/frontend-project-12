import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useWSocket } from '../../contexts/SocketContext';
import { modalsActions, channelsActions } from '../../slices/index.js';
import { selectCurrentId } from '../../slices/channelsSelectors.js';

const defaultChannel = 1;

const RemoveModalChannel = () => {
  const { t } = useTranslation();
  const wsocket = useWSocket();
  const dispatch = useDispatch();

  const channelId = useSelector((state) => state.modal.channelId);
  const currentId = useSelector(selectCurrentId);

  const handleClose = () => dispatch(modalsActions.isClose());

  const handleDeleteClick = async () => {
    try {
      await wsocket.emitRemoveChannel(channelId);
      handleClose();
      if (channelId === currentId) {
        dispatch(channelsActions.setCurrentChannelId(defaultChannel));
      }
      toast.success(t('toasts.removeChannel'));
    } catch (error) {
      toast.error(t('toasts.connectError'));
    }
  };

  return (
    <Modal show onHide={handleClose} centered>
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
        <Button variant="danger" onClick={handleDeleteClick}>
          {t('modal.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RemoveModalChannel;
