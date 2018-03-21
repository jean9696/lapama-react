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
import firebaseConfig from 'firebase/config';

const firebase = {
  app: firebaseApp.initializeApp(firebaseConfig),
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
