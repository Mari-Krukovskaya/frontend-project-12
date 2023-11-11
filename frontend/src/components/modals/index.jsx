import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import AddModalChannel from './AddModalChannel.jsx';
import RemoveModalChannel from './RemoveModalChannel.jsx';
import RenameModalChannel from './RenameModalChannel.jsx';
import { modalsActions } from '../../slices/index.js';

const modals = {
  adding: AddModalChannel,
  removing: RemoveModalChannel,
  renaming: RenameModalChannel,
};

const ShowModal = () => {
  const dispatch = useDispatch();
  const { type, show } = useSelector((state) => state.modal);
  // eslint-disable-next-line
  // debugger

  const handleClose = () => {
    dispatch(modalsActions.isClose({ type: null, channelId: null }));
  };

  if (!type) {
    return null;
  }

  const ComponentModal = modals[type];
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered"
    >
      <ComponentModal />
    </Modal>
  );
};

export default ShowModal;
