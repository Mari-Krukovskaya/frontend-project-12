/* eslint-disable */
import React, { createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messagesSlice.js';
import {
  addChannel,
  updateChannel,
  deleteChannel,
  setCurrentChannelId,
} from '../slices/channelsSlice.js';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ socket, children }) => {
  const dispatch = useDispatch();

  const handleConnect = () => {
    console.log(socket.connected, 'socket connect');
  };

  const handleDisconnect = () => {
    console.log(socket.connected, 'socket disconnect');
  };

  const handleNewMessage = (message) => {
    dispatch(addMessage(message));
  };

  const handleNewChannel = (channel) => {
    dispatch(addChannel(channel));
  };

  const handleRemoveChannel = ({ id }) => {
    dispatch(deleteChannel(id));
  };

  const handleRenameChannel = ({ id, name }) => {
    dispatch(updateChannel({ id, changes: { name } }));
  };

  const emitNewMessage = async (body, channelId, username) => {
    await socket.emit('newMessage', { body, channelId, username });
  };

  const emitAddChannel = async (val) => {
    try {
      const response = await socket.emit('newChannel', val);
      dispatch(addChannel(response.data));
      dispatch(setCurrentChannelId(response.data.id));
    } catch (error) {
      console.log(error);
    }
  };

  const emitRemoveChannel = async (id) => {
    await socket.emit('removeChannel', { id });
  };

  const emitRenameChannel = async ({ id, name }) => {
    await socket.emit('renameChannel', { id, name });
  };

  React.useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('newchannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('newchannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, []);

  return (
    <WSocketContext.Provider
      value={{
        emitNewMessage,
        emitAddChannel,
        emitRemoveChannel,
        emitRenameChannel,
      }}
    >
      {children}
    </WSocketContext.Provider>
  );
};
export default WSocketProvider;
