import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setCurrentChannelId, selectorsChannels } from '../slices/channelsSlice.js';
import { isOpen } from '../slices/modalSlice.js';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectorsChannels.selectAll);
  const { currentChannelId } = channels;
  const handleCurrentChannel = (id) => {
    dispatch(setCurrentChannelId({ currentChannel: id }));
  };

  const handleRemoveChannel = (id, name) => {
    dispatch(isOpen({ type: 'removing', channelId: id, channelName: name }));
  };

  const handleRenameChannel = (id, name) => {
    dispatch(isOpen({ type: 'renaming', channelId: id, channelName: name }));
  };
  const classChannelActive = channels.id === currentChannelId ? 'btn-secondary' : '';
  return (
    <Nav
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => {
        return (
          <Nav.Item key={channel.id} className="nav-item w-100">
            <Dropdown as={ButtonGroup}>
              <Button
                onClick={() => handleCurrentChannel(channel.id)}
                type="button"
                className={`w-100 rounded-0 text-start text-truncate ${classChannelActive}`}
                variant=""
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable && (
                <>
                  <Dropdown.Toggle
                    aria-expanded="false"
                    variant=""
                    className={`flex-grow-0 dropdown-toggle-split ${classChannelActive}`}
                  >
                    <span className="visuall-hidden">
                      {t('modal.channelControl')}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleRemoveChannel(channel.id, channel.name)}
                    >
                      {t('modal.removeModalChannel')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleRenameChannel(channel.id, channel.name)}
                    >
                      {t('modal.renameModalChannel')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

export default Channels;
