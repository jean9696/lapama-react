import {
  firebaseCreateSuccess,
  firebaseError,
  firebaseReadSuccess,
  firebaseUpdateSuccess,
  firebaseDeleteSuccess,
  firebaseAddSubscription,
  firebaseRemoveSubscription,
} from './firebase.act';
import { select } from 'redux/reducers';
import { insertFirebaseKeys } from './firebaseHelpers';

export const firebaseCreate = (collectionRef, entity, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const firebaseData = select.firebaseData(state);
    firebaseData.ref(collectionRef(state)).push(entity)
    .then(res => {
      if (callback) callback(res);
      dispatch(firebaseCreateSuccess({ id: res.key, ...entity }, collectionRef(state)));
    })
    .catch(err => dispatch(firebaseError(err)));
  };

export const firebaseSubscribe = (collectionRef) =>
  (dispatch, getState) => {
    const state = getState();
    const firebaseData = select.firebaseData(state);
    dispatch(firebaseAddSubscription(collectionRef(state)));
    firebaseData.ref(collectionRef(state)).on('value', res => {
      dispatch(firebaseReadSuccess(collectionRef(state), insertFirebaseKeys(res.val())));
    });
  };

export const firebaseUnsubscribe = (collectionRef) =>
  (dispatch, getState) => {
    const state = getState();
    dispatch(firebaseRemoveSubscription(collectionRef(state)));
  };

export const firebaseRead = (collectionRef, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const firebaseData = select.firebaseData(state);
    firebaseData.ref(collectionRef(state)).once('value')
    .then(res => {
      if (callback) callback(res);
      dispatch(firebaseReadSuccess(collectionRef(state), insertFirebaseKeys(res.val())));
    })
    .catch(err => dispatch(firebaseError(err)));
  };

export const firebaseUpdate = (updates, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const updatesObject = updates.reduce((context, update) => ({
      [update.ref(state)]: update.entity,
      ...context,
    }), {});
    const firebaseData = select.firebaseData(state);
    firebaseData.ref().update(updatesObject)
      .then(res => {
        if (callback) callback(res);
        dispatch(firebaseUpdateSuccess(updatesObject));
      })
      .catch(err => dispatch(firebaseError(err)));
  };

export const firebaseDelete = (collectionRef, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const firebaseData = select.firebaseData(state);
    firebaseData.ref(collectionRef(state)).remove()
      .then(res => {
        // todo: test this
        if (callback) callback(res);
        dispatch(firebaseDeleteSuccess(collectionRef(state), insertFirebaseKeys(res.val())));
      })
      .catch(err => dispatch(firebaseError(err)));
  };
