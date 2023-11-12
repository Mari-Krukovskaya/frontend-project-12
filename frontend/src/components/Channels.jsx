import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown, Col } from 'react-bootstrap';
import cn from 'classnames';
import { FaPlus } from 'react-icons/fa';
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
  // debugger
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

  const renderChannel = (channel) => {
    if (channel.removable) {
      return (
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
    }
    return (
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          onClick={() => handleCurrentChannel(channel.id)}
          type="button"
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
      </Dropdown>
    );
  };

  // const defaultChannel = (channel) => (
  //   <Button
  //     onClick={() => handleCurrentChannel(channel.id)}
  //     type="button"
  //     className={cn('w-100 rounded-0 text-start btn', {
  //       'btn-secondary': currentlId === channel.id,
  //     })}
  //   >
  //     <span className="me-1">#</span>
  //     {channel.name}
  //   </Button>
  // );

  // const addNewChannel = (channel) => {
  //   <Dropdown as={ButtonGroup} className="d-flex">
  //     <Button
  //       onClick={() => handleCurrentChannel(channel.id)}
  //       type="button"
  //       // variant={currentlId === channel.id ? 'secondary' : null}
  //       // key={channel.id}
  //       className={cn('w-100 rounded-0 text-start btn text-truncate', {
  //         'btn-secondary': currentlId === channel.id,
  //       })}
  //     >
  //       <span className="me-1">#</span>
  //       {channel.name}
  //     </Button>
  //     <Dropdown.Toggle
  //       split
  //       id="bg-nested-dropdown"
  //       variant={currentlId === channel.id ? 'secondary' : null}
  //       className="flex-grow-0"
  //     >
  //       <span className="visuall-hidden">{t('modal.channelControl')}</span>
  //     </Dropdown.Toggle>
  //     <Dropdown.Menu>
  //       <Dropdown.Item onClick={() => handleRemoveChannel(channel.id)}>
  //         {t('modal.removeModalChannel')}
  //       </Dropdown.Item>
  //       <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>
  //         {t('modal.renameModalChannel')}
  //       </Dropdown.Item>
  //     </Dropdown.Menu>
  //   </Dropdown>;
  // };

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
            {renderChannel(channel)}
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default Channels;
