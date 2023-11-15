import { useSelector } from 'react-redux';
import AddModalChannel from './AddModalChannel.jsx';
import RemoveModalChannel from './RemoveModalChannel.jsx';
import RenameModalChannel from './RenameModalChannel.jsx';

const modals = {
  adding: AddModalChannel,
  removing: RemoveModalChannel,
  renaming: RenameModalChannel,
};

const ShowModal = () => {
  const type = useSelector((state) => state.modal.type);

  const ComponentModal = modals[type];
  return (
    (ComponentModal === undefined ? null : <ComponentModal />)
  );
};

export default ShowModal;
