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
  const variant = channel.id === currentChannelId ? 'secondary' : 'default';

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button
        variant={variant}
        key={channel.id}
        onClick={handleCurrentChannel}
        type="button"
        className="w-100 rounded-0 text-start text-truncate"
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      <Dropdown.Toggle split variant={variant} className="flex-grow-0">
        <span className="visually-hidden">{t('modal.channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#" onClick={handleRemoveChannel}>
          {t('modal.removeModalChannel')}
        </Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleRenameChannel}>
          {t('modal.renameModalChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default NewChannel;