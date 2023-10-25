import { useWSocket } from '../../contexts/SocketContext';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const RemoveModalChannel = ({ id, show, handleClose }) => {
  const { t } = useTranslation()
   const wsocket = useWSocket();
  
    const handleClick = async (id) => {
      try {
        await wsocket.emitRemoveChannel({ id });
        toast.success(t('toasts.removeChannel'));
        handleClose();
      } catch (error) {
        toast.error(t('toasts.errorChannel'));
        console.error(error);
      }
    };
    const handleButtonClick = async () => {
        await handleClick(id);
      };

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
          <Button variant="primary" onClick={handleButtonClick}>
            {t('modal.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
