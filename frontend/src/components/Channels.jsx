import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown, Col } from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { selectCurrentId, selectors } from '../slices/channelsSelectors.js';
import { modalsActions, channelsActions } from '../slices/index.js';
import store from '../slices/store.js';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const currentlId = useSelector(selectCurrentId);
  // eslint-disable-next-line
  debugger
  const handleAddChannel = () => {
    dispatch(
      modalsActions.isOpen({ type: 'adding', show: true, channelId: null }),
    );
  };

  const handleCurrentChannel = (id) => {
    store.dispatch(channelsActions.setCurrentChannelId({ currentlId: id }));
  };

  const handleRemoveChannel = (id) => {
    dispatch(
      modalsActions.isOpen({ type: 'removing', show: true, channelId: id }),
    );
  };

  const handleRenameChannel = (id) => {
    dispatch(
      modalsActions.isOpen({ type: 'renaming', show: true, channelId: id }),
    );
  };
  const defaultChannel = (channel) => (
    <Button
      onClick={() => handleCurrentChannel(channel.id)}
      type="button"
      className={cn('w-100 rounded-0 text-start btn', {
        'btn-secondary': currentlId === channel.id,
      })}
    >
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  );

  const addNewChannel = (channel) => {
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button
        onClick={() => handleCurrentChannel(channel.id)}
        type="button"
        // variant={currentlId === channel.id ? 'secondary' : null}
        // key={channel.id}
        className={cn('w-100 rounded-0 text-start btn text-truncate', {
          'btn-secondary': currentlId === channel.id,
        })}
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      <Dropdown.Toggle
        split
        id="bg-nested-dropdown"
        variant={currentlId === channel.id ? 'secondary' : null}
        className="flex-grow-0"
      >
        <span className="visuall-hidden">{t('modal.channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleRemoveChannel(channel.id)}>
          {t('modal.removeModalChannel')}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>
          {t('modal.renameModalChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>;
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
        </Button>
      </div>

      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            {channel.removable === false
              ? defaultChannel(channel)
              : addNewChannel(channel)}
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default Channels;
