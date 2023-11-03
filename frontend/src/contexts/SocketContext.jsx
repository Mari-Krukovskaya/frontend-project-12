/* eslint-disable */
import React, { createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messagesSlice.js';
import {
  addChannel,
  updateChannel,
  deleteChannel,
} from '../slices/channelsSlice.js';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ socket, children }) => {
const dispatch = useDispatch();

socket.on('connect', () => {
  console.log(socket.connected, 'socket connect');
});

socket.on('disconnect', () => {
  console.log(socket.connected, 'socket disconnect');
});

socket.on('newMessage', (message) => {
  dispatch(addMessage(message));
});

socket.on('newchannel', (channel) => {
  dispatch(addChannel(channel));
});

socket.on('removeChannel', ({ id }) => {
  dispatch(deleteChannel(id));
});

socket.on('renameChannel', ({ id, name }) => {
  dispatch(updateChannel({ id, changes: { name }}));
});

  const emitNewMessage = (msg) =>
    new Promise((resolve, reject) => {
      socket.timeout(1000).emit('newMessage', msg, (error, response) => {
        if (response?.status === 'ok') {
          resolve(response?.data);
        } else {
          reject(error);
        }
      });
    });

  const emitAddChannel = (name) =>
    new Promise((resolve, reject) => {
      socket.timeout(1000).emit('newChannel', { name }, (error, response) => {
        if (response?.status === 'ok') {
          resolve(response?.data);
        } else {
          reject(error);
        }
      });
    });

  const emitRemoveChannel = (id) =>
    new Promise((resolve, reject) => {
      socket.timeout(1000).emit('removeChannel', { id }, (error, response) => {
        if (response?.status === 'ok') {
          resolve(response?.data);
        } else {
          reject(error);
        }
      });
    });

  const emitRenameChannel = (id, name) =>
    new Promise((resolve, reject) => {
      socket
        .timeout(1000)
        .emit('renameChannel', { id, name }, (error, response) => {
          if (response?.status === 'ok') {
            resolve(response?.data);
          } else {
            reject(error);
          }
        });
    });

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
