import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  setCurrentChannelId,
  selectorsChannels,
} from '../slices/channelsSlice.js';
import Channel from './Channel.jsx';
import DefaultChannel from './DefaultChannel.jsx';
import { isOpen } from '../slices/modalSlice.js';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectorsChannels.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannelId);

  const handleCurrentChannel = (id) => {
    dispatch(setCurrentChannelId({ currentChannel: id }));
  };

  const handleAddChannel = () => {
    dispatch(isOpen({ type: 'add', channelId: null }));
  };

  const handleRemoveChannel = (id) => {
    dispatch(isOpen({ type: 'delete', channelId: id }));
  };

  const handleRenameChannel = (id) => {
    dispatch(isOpen({ type: 'update', channelId: id }));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('modal.nameChannel')}</b>
        <Button
          variant="light"
          onClick={handleAddChannel}
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visuall-hidden">+</span>
        </Button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => {
          if (channel.removable === false) {
            return (
              <DefaultChannel
                key={channel.id}
                channel={channel}
                currentChannel={currentChannel}
                handleCurrentChannel={handleCurrentChannel}
              />
            );
          }
          return (
            <Channel
              key={channel.id}
              channel={channel}
              currentChannel={currentChannel}
              handleCurrentChannel={handleCurrentChannel}
              handleRemoveChannel={handleRemoveChannel}
              handleRenameChannel={handleRenameChannel}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Channels;
