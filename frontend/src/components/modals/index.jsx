import { AddModalChannel } from './AddModalChannel.jsx';
import { RemoveModalChannel } from './RemoveModalChannel.jsx';
import { RenameModalChannel } from './RenameModalChannel.jsx';

const modals = {
    adding: AddModalChannel,
    removing: RemoveModalChannel,
    renaming: RenameModalChannel,
};

export default (modalName) => modals[modalName];
