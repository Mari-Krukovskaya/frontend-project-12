import { useDispatch, useSelector } from 'react-redux';
import { Button, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import {
  selectors,
  selectCurrentChannelId,
} from '../slices/channelsSelectors.js';
import { channelsActions, modalsActions } from '../slices/index.js';
import NewChannel from './NewChannel.jsx';
import store from '../slices/store.js';

const DefaultChannel = ({ channel, handleCurrentChannel }) => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  return (
    <Button
      type="button"
      variant={channel.id === currentChannelId ? 'secondary' : 'default'}
      className="w-100 rounded-0 text-start"
      onClick={() => handleCurrentChannel(channel.id)}
    >
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  );
};
const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);

  const handleAddChannel = () => {
    dispatch(
      modalsActions.isOpen({ type: 'adding', show: true, channelId: '' }),
    );
  };

  const handleCurrentChannel = (id) => {
    store.dispatch(channelsActions.setCurrentChannelId(id));
  };

  const handleRemoveChannel = (channel) => {
    dispatch(
      modalsActions.isOpen({ type: 'removing', show: true, channelId: channel }),
    );
  };

  const handleRenameChannel = (channel) => {
    dispatch(
      modalsActions.isOpen({ type: 'renaming', show: true, channelId: channel }),
    );
  };

  return (
    <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('modal.channels')}</b>
        <Button
          onClick={handleAddChannel}
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <span className="visually-hidden">+</span>
          <FaPlus
            style={{ color: 'white', stroke: 'white', strokeWidth: '1px' }}
          />
        </Button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            {!channel.removable ? (
              <DefaultChannel
                channel={channel}
                handleCurrentChannel={handleCurrentChannel}
              />
            ) : (
              <NewChannel
                channel={channel}
                handleCurrentChannel={() => handleCurrentChannel(channel.id)}
                handleRemoveChannel={() => handleRemoveChannel(channel.id)}
                handleRenameChannel={() => handleRenameChannel(channel.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default Channels;
