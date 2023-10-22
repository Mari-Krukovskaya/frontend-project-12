import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage } from '../slices/messagesSlice';
import { addChannel, updateChannel, deleteChannel, setCurrentChannelId } from '../slices/channelsSlice';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socket = useMemo(() => io(), []);

  useEffect(() => {
    socket.on('newMessage', (response) => {
      dispatch(addMessage(response));
    });

    socket.on('newChannel', (response) => {
      dispatch(addChannel(response));
      dispatch(setCurrentChannelId(response.id));
    });

    socket.on('renameChannel', (response) => {
      const { id, name } = response;
      dispatch(updateChannel({ id, changes: { name } }));
    });

    socket.on('removeChannel', (response) => {
      dispatch(deleteChannel(response.id));
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('renameChannel');
      socket.off('removeChannel');
    };
  }, [dispatch]);

  const emitNewMessage = (msg) => new Promise((resolve, reject) => {
    socket
      .timeout(1000)
      .emit('newMessage', msg, (error, response) => (
        response?.status === 'ok' ? resolve(response?.data) : reject(error)
      ));
  });

  const emitAddChannel = (name) => new Promise((resolve, reject) => {
    socket
      .timeout(1000)
      .emit('newChannel', { name }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response?.data);
        }
      });
  });

  const emitRemoveChannel = (id) => new Promise((resolve, reject) => {
    socket
      .timeout(1000)
      .emit('removeChannel', { id }, (error, response) => (
        response?.status === 'ok' ? resolve(response?.data) : reject(error)
      ));
  });

  const emitRenameChannel = (id, name) => new Promise((resolve, reject) => {
    socket
      .timeout(1000)
      .emit('renameChannel', { id, name }, (error, response) => (
        response?.status === 'ok' ? resolve(response?.data) : reject(error)
      ));
  });

  const wSocketContextValue = useMemo(() => ({
    emitNewMessage,
    emitAddChannel,
    emitRemoveChannel,
    emitRenameChannel,
  }), [emitNewMessage, emitAddChannel, emitRemoveChannel, emitRenameChannel]);

  return (
    <WSocketContext.Provider value={wSocketContextValue}>
      {children}
    </WSocketContext.Provider>
  );
};

export default WSocketProvider;
