import { combineReducers } from 'redux';
import firebase, * as fromFirebase from 'firebase/firebase.red';

const config = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
// todo: handle additional reducers in src
const reducers = {
  config,
  firebase,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;


export const exportSelectors = (reducerName, from) => ({
  // overload the first argument of the selectors with the state of
  // the specific reducer...
  // create a new overloaded arguments array...
  // apply the new arguments to the selector function...
  ...from,
  ...Object.keys(from.selectors || {}).reduce((context, s) => ({
    ...context,
    [s]: (state, ...args) => from.selectors[s].apply(null, [state[reducerName], ...args]),
  }), {}),
});

const selectInternal = {
  ...exportSelectors('firebase', fromFirebase),
};


export const select = {
  ...selectInternal,
};
