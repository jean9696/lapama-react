import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import registerServiceWorker from 'registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from 'redux/configureStore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Router,
  browserHistory,
  Route,
  IndexRoute,
} from 'react-router';
import * as firebaseApp from 'firebase';
import { syncHistoryWithStore } from 'react-router-redux';
import Login from 'Login/Login';
import App from 'App';
import ConnectedLayout from 'components/ConnectedLayout';
import Register from 'Login/Register';
import Calendar from 'Calendar/Calendar';
import ResetPassword from 'Login/ResetPassword';


const firebase = {
  app: firebaseApp.initializeApp({
    apiKey: 'AIzaSyB1vnhNUMd71eejrSkLmg254rBwfCiTWTk',
    authDomain: 'maximal-relic-150922.firebaseapp.com',
    databaseURL: 'https://maximal-relic-150922.firebaseio.com',
    projectId: 'maximal-relic-150922',
    storageBucket: 'maximal-relic-150922.appspot.com',
    messagingSenderId: '318528776798',
  }),
  files: {},
  collections: {},
  subscriptions: {},
};


const store = configureStore({ firebase, browserHistory });
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route component={App} >
          <Route path="/" component={ConnectedLayout}>
            <IndexRoute component={Calendar} />
            <Route path="test" component={() => <div>register</div>} />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/reset-password" component={ResetPassword} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('root')); // eslint-disable-line no-undef
registerServiceWorker();
