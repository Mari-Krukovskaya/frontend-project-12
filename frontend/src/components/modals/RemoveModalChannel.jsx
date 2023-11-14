import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useWSocket } from '../../contexts/SocketContext';
// import { selectCurrentChannelId } from '../../slices/channelsSelectors.js';
import { modalsActions, channelsActions } from '../../slices/index.js';
import store from '../../slices/store.js';

const defaultChannel = 1;

const RemoveModalChannel = () => {
  const { t } = useTranslation();
  const wsocket = useWSocket();
  const dispatch = useDispatch();

  // const channelId = useSelector(selectCurrentChannelId);
  const { channelId } = useSelector((state) => state.modal);

  const handleClose = () => dispatch(modalsActions.isClose());

  const handleDeleteClick = async () => {
    try {
      await wsocket.emitRemoveChannel({ id: channelId });
      store.dispatch(channelsActions.setCurrentChannelId(defaultChannel));
      toast.success(t('toasts.removeChannel'));
      // setSubmitting(true);
      handleClose();
    } catch (error) {
      // formik.setSubmitting(false);
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
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose}>
            {t('modal.buttonCancel')}
          </Button>
          <Button variant="danger" onClick={handleDeleteClick()}>
            {t('modal.delete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default RemoveModalChannel;
