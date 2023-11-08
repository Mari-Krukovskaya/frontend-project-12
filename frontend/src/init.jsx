import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import { Provider as ProviderRoll, ErrorBoundary } from '@rollbar/react';
import store from './slices/store.js';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext.js';
import resources from './locales/index.js';
import WSocketProvider from './contexts/SocketContext.js';

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

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR,
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
                  <ToastContainer />
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
