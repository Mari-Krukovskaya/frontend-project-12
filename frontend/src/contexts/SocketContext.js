/* eslint-disable */
import React, { createContext, useContext } from 'react';
import { channelsActions, messagesActions } from '../slices/index';
import store from '../slices/store';

export const WSocketContext = createContext(null);
export const useWSocket = () => useContext(WSocketContext);

const WSocketProvider = ({ socket, children }) => {
  const handleConnect = () => {
    console.log(socket.connected, 'socket connect');
  };

  const handleDisconnect = () => {
    console.log(socket.connected, 'socket disconnect');
  };

  const handleNewMessage = (message) => {
    store.dispatch(messagesActions.addMessage(message));
  };

  const handleNewChannel = (channel) => {
    store.dispatch(channelsActions.addChannel(channel));
  };

  const handleRemoveChannel = ({ id }) => {
    store.dispatch(channelsActions.deleteChannel(id));
  };

  const handleRenameChannel = ({ id, name }) => {
    store.dispatch(channelsActions.updateChannel({ id, changes: { name } }));
  };

  const emitNewMessage = async ({body, channelId, username}) => {
    try {
      await new Promise((resolve, reject) => {
        socket.timeout(1000).emit('newMessage',{ body, channelId, username },
        (error, response) => {
              if (response?.status === 'ok') {
                resolve(response);
              } else {
                reject(error);
              }
            }
          );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const emitAddChannel = async (val) => {
    try {
      const response = await new Promise((resolve, reject) => {
        socket.timeout(1000).emit('newChannel', val, (error, response) => {
            if (response?.status === 'ok') {
              resolve(response);
            } else {
              reject(error);
            }
          });
      });
      store.dispatch(channelsActions.addChannel(response.data));
      store.dispatch(channelsActions.setCurrentChannelId(response.data.id));
    } catch (error) {
      console.log(error);
    }
  };

  const emitRemoveChannel = async (id) => {
    await new Promise((resolve, reject) => {
      socket.timeout(1000).emit('removeChannel', { id }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
  };

  const emitRenameChannel = async ({ id, name }) => {
    await new Promise((resolve, reject) => {
      socket.timeout(1000).emit('renameChannel', { id, name }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
    });
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
