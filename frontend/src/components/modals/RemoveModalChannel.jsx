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
  const dispatch = useDispatch();
  const { emitRemoveChannel } = useWSocket();

  const { channelId, show } = useSelector((state) => state.modal);
  const currentId = useSelector(selectCurrentId);

  const handleClose = () => dispatch(modalsActions.isClose());

  const handleDeleteClick = async () => {
    try {
      await emitRemoveChannel(channelId);
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modal.areYouSure')}</p>
      <div className="d-flex justify-content-end">
        <Button type="button" variant="secondary" className="me-2" onClick={handleClose}>
          {t('modal.buttonCancel')}
        </Button>
        <Button type="submit" variant="danger" onClick={handleDeleteClick}>
          {t('modal.delete')}
        </Button>
      </div>
      </Modal.Body>
    </Modal>
  );
};
export default RemoveModalChannel;
