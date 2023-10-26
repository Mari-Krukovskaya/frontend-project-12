import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import { Provider, useDispatch } from 'react-redux';
import { addMessage } from './slices/messagesSlice.js';
import {
  addChannel,
  updateChannel,
  deleteChannel,
} from './slices/channelsSlice.js';
import store from './slices/store.js';
import App from './components/App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import resources from './locales/index.js';
import WSocketProvider from './contexts/SocketContext.jsx';

const init = async (socket) => {
  const dispatch = useDispatch();
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    fallbackLng: 'ru',
    debug: true,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('fr'));
  filter.add(filter.getDictionary('ru'));

  socket.on('newMessage', (payload) => dispatch(addMessage(payload)));
  socket.on('newchannel', (payload) => dispatch(addChannel(payload)));
  socket.on('removeChannel', (payload) => dispatch(deleteChannel(payload.id)));
  socket.on('renameChannel', (payload) => {
    dispatch(
      updateChannel({
        id: payload.id,
        changes: { name: payload.name },
      }),
    );
  });
  return (
    <React.StrictMode>
      {/* <ErrorBoundary> */}
      <Provider store={store}>
        <WSocketProvider socket={socket}>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </AuthProvider>
        </WSocketProvider>
      </Provider>
      {/* </ErrorBoundary> */}
    </React.StrictMode>
  );
};
export default init;
