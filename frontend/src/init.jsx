import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import { Provider as ProviderRoll, ErrorBoundary } from '@rollbar/react';
import { addMessage } from './slices/messagesSlice.js';
import {
  addChannel,
  updateChannel,
  deleteChannel,
} from './slices/channelsSlice.js';
import store from './slices/store.js';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext.jsx';
import resources from './locales/index.js';
import WSocketProvider from './contexts/SocketContext.jsx';

const init = async (socket) => {
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
  filter.add(filter.getDictionary('ru'));

  socket.on('connect', () => {
    console.log(socket.connected, 'socket connect');
  });
  socket.on('disconnect', () => {
    console.log(socket.connected, 'socket disconnect');
  });

  socket.on('newMessage', (payload) => store.dispatch(addMessage(payload)));
  socket.on('newchannel', (payload) => store.dispatch(addChannel(payload)));
  socket.on('removeChannel', (payload) => store.dispatch(deleteChannel(payload.id)));
  socket.on('renameChannel', (payload) => {
    store.dispatch(
      updateChannel({
        id: payload.id,
        changes: { name: payload.name },
      }),
    );
  });

  const rollbarConfig = {
    accessToken: '15d98753f8064629a7ab2ec4aec6d3a3',
    environment: 'testenv',
  };

  return (
    <React.StrictMode>
      <ProviderRoll config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <WSocketProvider socket={socket}>
              <AuthProvider>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </AuthProvider>
            </WSocketProvider>
          </Provider>
        </ErrorBoundary>
      </ProviderRoll>
    </React.StrictMode>
  );
};
export default init;
