import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'redux/reducers';
import { routerMiddleware } from 'react-router-redux';

export default function configureStore(initialState) {
  const middlewares = [
    thunk,
    routerMiddleware(initialState.browserHistory),
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
