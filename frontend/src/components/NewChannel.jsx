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
  const newClassActive = channel.id === currentChannelId ? 'btn-primary' : '';

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button
        variant={newClassActive}
        key={channel.id}
        onClick={() => handleCurrentChannel(channel.id)}
        type="button"
        className={`w-100 rounded-0 text-start btn text-truncate ${newClassActive}`}
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      <Dropdown.Toggle split variant={newClassActive} className={`flex-grow-0 ${newClassActive}`}>
        <span className="visually-hidden">{t('modal.channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleRemoveChannel(channel.id)} eventKey="1">
          {t('modal.removeChannel')}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleRenameChannel(channel.id)} eventKey="2">
          {t('modal.renameChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default NewChannel;
