import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useWSocket } from '../../contexts/SocketContext';
import { selectCurrentChannelId } from '../../slices/channelsSelectors.js';
import { modalsActions, channelsActions } from '../../slices/index.js';
import store from '../../slices/store.js';
import notify from '../notify.js';

const defaultChannel = 1;

const RemoveModalChannel = ({ channel }) => {
  const { t } = useTranslation();
  const wsocket = useWSocket();
  const dispatch = useDispatch();

  const channelId = useSelector(selectCurrentChannelId);

  const handleClose = () => dispatch(modalsActions.isClose({ type: 'delete', channelId }));

  const handleDeleteClick = async ({ setSubmitting }) => {
    try {
      await wsocket.emitRemoveChannel(channel.id);
      if (channelId === channel.id) {
        store.dispatch(channelsActions.setCurrentChannelId(defaultChannel));
      }
      toast.success(t('toasts.removeChannel'), notify);
      handleClose();
      setSubmitting(true);
    } catch (error) {
      toast.error(t('toasts.errorChannel'), notify);
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeModalChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.areYouSure')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={handleClose}
            type="button"
            className="me-2"
          >
            {t('modal.buttonCancel')}
          </Button>

          <Button
            variant="danger"
            onClick={() => handleDeleteClick(channelId)}
            type="submit"
          >
            {t('modal.delete')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};
export default RemoveModalChannel;
