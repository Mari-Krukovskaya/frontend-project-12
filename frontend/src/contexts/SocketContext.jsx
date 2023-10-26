/* eslint-disable */
import React, { createContext, useContext } from 'react';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ socket, children }) => {
  const emitNewMessage = (msg) =>
    new Promise((resolve, reject) => {
      socket
      .timeout(1000)
      .emit('newMessage', msg, (error, response) => {
        response?.status === 'ok' ? resolve(response?.data) : reject(error);
      });
    });

  const emitAddChannel = (name) =>
    new Promise((resolve, reject) => {
      socket
        .timeout(1000)
        .emit('newChannel', { name }, (error, response) =>
          response?.status === 'ok' ? resolve(response?.data) : reject(error)
        );
    });

  const emitRemoveChannel = (id) =>
    new Promise((resolve, reject) => {
      socket
        .timeout(1000)
        .emit('removeChannel', { id }, (error, response) =>
          response?.status === 'ok' ? resolve(response?.data) : reject(error)
        );
    });

  const emitRenameChannel = (id, name) =>
    new Promise((resolve, reject) => {
      socket
        .timeout(1000)
        .emit('renameChannel', { id, name }, (error, response) => {
          response?.status === 'ok' ? resolve(response?.data) : reject(error);
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
