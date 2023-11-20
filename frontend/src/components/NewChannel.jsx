import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCurrentChannel } from '../slices/channelsSelectors.js';

const NewChannel = ({
  channel,
  handleCurrentChannel,
  handleRemoveChannel,
  handleRenameChannel,
}) => {
  const { t } = useTranslation();
  const currentChannelId = useSelector(selectCurrentChannel);
  const variant = channel.id === currentChannelId ? 'secondary' : null;
  // eslint-disable-next-line
  // debugger;
  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button
        variant={variant}
        key={channel.id}
        onClick={() => handleCurrentChannel(channel.id)}
        type="button"
        className="w-100 rounded-0 text-start btn text-truncate"
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      <Dropdown.Toggle split id="dropdown-split-basic" variant={variant} className="flex-grow-0">
        <span className="visually-hidden">{t('modal.channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#" onClick={() => handleRemoveChannel(channel.id)}>
          {t('modal.removeModalChannel')}
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => handleRenameChannel(channel.id)}>
          {t('modal.renameModalChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default NewChannel;
