import { useWSocket } from '../../contexts/SocketContext';
import { Button, Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const RemoveModalChannel = ({ id, show, handleClose }) => {
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
          <Modal.Title>Remove Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove the channel?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleButtonClick}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };