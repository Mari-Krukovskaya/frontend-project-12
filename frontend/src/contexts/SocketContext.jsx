import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messagesSlice';
import {
  addChannel,
  setCurrentChannelId,
  updateChannel,
  deleteChannel,
} from '../slices/channelsSlice';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socket = io();

  const wSocketContextValue = useMemo(() => {
    return {
      emitNewMessage: (msg) => new Promise((resolve, reject) => {
        socket
          .timeout(1000)
          .emit('newMessage', msg, (error, response) => {
            if (response?.status === 'ok') {
              resolve(response?.data);
              dispatch(addMessage(response));
            } else {
              reject(error);
            }
          });
      }),

      emitAddChannel: (name) => new Promise((resolve, reject) => {
        socket
          .timeout(1000)
          .emit('newChannel', { name }, (error, response) => {
            if (response?.status === 'ok') {
              resolve(response?.data);
              dispatch(addChannel(response));
              dispatch(setCurrentChannelId(response.id));
            } else {
              reject(error);
            }
          });
      }),

      emitRemoveChannel: (id) => new Promise((resolve, reject) => {
        socket
          .timeout(1000)
          .emit('removeChannel', { id }, (error, response) => {
            if (response?.status === 'ok') {
              resolve(response?.data);
              dispatch(deleteChannel(id));
            } else {
              reject(error);
            }
          });
      }),

      emitRenameChannel: (id, name) => new Promise((resolve, reject) => {
        socket
          .timeout(1000)
          .emit('renameChannel', { id, name }, (error, response) => {
            if (response?.status === 'ok') {
              resolve(response?.data);
              dispatch(updateChannel(id, name));
            } else {
              reject(error);
            }
          });
      }),

    };
  }, [socket, dispatch]);

  return (
    <WSocketContext.Provider value={wSocketContextValue}>
      {children}
    </WSocketContext.Provider>
  );
};

export default WSocketProvider;
