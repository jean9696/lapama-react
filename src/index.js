import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import App from 'App';
import registerServiceWorker from 'registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from 'redux/configureStore';
import theme from 'react-toolbox-theme/theme'; //eslint-disable-line
import 'react-toolbox-theme/theme.css'; //eslint-disable-line
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
  , document.getElementById('root')); // eslint-disable-line no-undef
registerServiceWorker();
