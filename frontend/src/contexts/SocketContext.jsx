import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messagesSlice';
import { addChannel, updateChannel, deleteChannel } from '../slices/channelsSlice';
import { io } from 'socket.io-client';


export const SocketContext = createContext();

const socket = io();

export const ApiProvider = ({ children }) => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      socket.on('message', (response) => {
        dispatch(addMessage(response));
      });
      socket.on('newChannel', (response) => {
        dispatch(addChannel(response));
      });
      socket.on('updateChannel', (response) => {
        dispatch(updateChannel(response));
      });
  
      socket.on('deleteChannel', (response) => {
        dispatch(deleteChannel(response));
      });

      return () => {
        socket.off('message');
        socket.off('newChannel');
        socket.off('updateChannel');
        socket.off('deleteChannel');
      };
    }, [dispatch]);
  
    const getNewMessage = (message) => {
      socket.emit('message', message, (response) => {
        if (response.status !== 'ok') {
          throw new Error('Failed to send message');
        }
      });
    };
  
    return (
      <SocketContext.Provider value={{ getNewMessage }}>
        {children}
      </SocketContext.Provider>
    );
  };
