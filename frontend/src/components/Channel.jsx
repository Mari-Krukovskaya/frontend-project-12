import React from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Channel = ({
  channel,
  currentChannel,
  handleCurrentChannel,
  handleRemoveChannel,
  handleRenameChannel,
}) => {
  const { t } = useTranslation();
  return (
    <li key={channel.id} className="nav-item w-100">
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          type="button"
          onClick={() => handleCurrentChannel(channel.id)}
          className="w-100 rounded-0 text-start btn text-truncate"
          variant={currentChannel === channel.id ? 'secondary' : null}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
        <Dropdown.Toggle
          split
          id="dropdown-split-basic"
          className="flex-grow-0"
          variant={currentChannel === channel.id ? 'secondary' : null}
        >
          <span className="visually-hidden">{t('modal.channelControl')}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item role="button" onClick={() => handleRemoveChannel(channel.id)}>
            {t('modal.removeModalChannel')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>
            {t('modal.renameModalChannel')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
};
export default Channel;
