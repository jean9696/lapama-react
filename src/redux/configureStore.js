import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'redux/reducers';
import * as firebaseApp from 'firebase';

const firebase = {
  app: firebaseApp.initializeApp({
    apiKey: 'AIzaSyCM-7gb9XLOZP-r4mJv3IOZsCe3OudoAas',
    authDomain: 'pokebeer-a8aac.firebaseapp.com',
    databaseURL: 'https://pokebeer-a8aac.firebaseio.com',
    storageBucket: 'pokebeer-a8aac.appspot.com',
  }),
  files: {},
  collections: {},
  subscriptions: {},
};

export default function configureStore(initialState = { firebase }) {
  const middlewares = [
    thunk,
  ];
  const enhancers = [
    applyMiddleware(...middlewares),
  ];
  const composeEnhancers = compose; //eslint-disable-line

  return createStore(
    reducers,
    initialState,
    composeEnhancers(...enhancers),
  );
}
