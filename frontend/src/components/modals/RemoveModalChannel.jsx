import { useWSocket } from '../../contexts/SocketContext';
import { Button, Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const RemoveModalChannel = ({ id, show, handleClose }) => {
  const { t } = useTranslation()
   const wsocket = useWSocket();
  
    const handleClick = async (id) => {
      try {
        await wsocket.emitRemoveChannel({ id });
        toast.success('Channel removed successfully');
        handleClose();
      } catch (error) {
        toast.error('Failed to remove channel');
        console.error(error);
      }
    };
    const handleButtonClick = async () => {
        await handleClick(id);
      };

    return (
      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Modal.removeModalChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('Modal.areYouSure')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('Modal.buttonCancel')}
          </Button>
          <Button variant="primary" onClick={handleButtonClick}>
            {t('Modal.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
