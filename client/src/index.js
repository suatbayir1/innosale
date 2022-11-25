import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from './store/store'

import 'react-notifications/lib/notifications.css';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

ReactDOM.render(
  <Provider store={store}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </Provider>,
  document.getElementById('root'),
);
