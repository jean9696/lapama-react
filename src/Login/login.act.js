import {
  firebaseError,
  firebaseLoginSuccess,
} from 'firebase/firebase.act';
import { firebaseUpdate } from 'firebase/firebaseCollections.act';
import { select } from 'redux/reducers';
import { push } from 'react-router-redux';
import { user as userRef } from 'collectionRefs';


export function connectUser(email, password, errorCallback = () => {}) {
  return (dispatch, getState) => {
    const state = getState();
    const firebaseAuth = select.firebaseAuth(state);
    firebaseAuth.signInWithEmailAndPassword(email.trim(), password).then((user) => {
      const firebaseData = select.firebaseData(state);
      return firebaseData.ref(`users/${user.uid}`).once('value')
        .then((res) => {
          dispatch(push('/'));
          dispatch(firebaseLoginSuccess(res.val()));
        });
    })
      .catch((err) => {
        dispatch(firebaseError(err));
        errorCallback();
      });
  };
}

export function connectUserByCookie(user) {
  return (dispatch, getState) => {
    const state = getState();
    const firebaseData = select.firebaseData(state);
    return firebaseData.ref(`users/${user.uid}`).once('value')
      .then((res) => {
        dispatch(firebaseLoginSuccess(res.val()));
      }).catch((err) => {
        dispatch(firebaseError(err));
      });
  };
}

export function createUserWithEmailAndPassword(email, password, user = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const firebaseAuth = select.firebaseAuth(state);
    firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then((res) => {
        dispatch(firebaseUpdate(
          [
            {
              ref: userRef(res.uid),
              entity: user,
            },
          ],
        ));
        dispatch(firebaseLoginSuccess(user));
        dispatch(push('/'));
      })
      .catch((err) => {
        dispatch(firebaseError(err));
      });
  };
}

export const logOut = () => (dispatch, getState) => {
  const state = getState();
  const firebaseAuth = select.firebaseAuth(state);
  firebaseAuth.signOut().then(() => {
    dispatch(push('/login'));
  }, (error) => {
    dispatch(firebaseError(error));
  });
  // todo: delete session
};
