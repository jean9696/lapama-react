import { Alert } from 'react-native';
import { goTo } from 'Router/router.act';
import { firebaseLoad, firebaseError, firebaseLoginSuccess }
from 'firebase/firebase.act';
import { select } from 'redux/reducers';

export function connectUserAndGoToMain(email, password) {
  return (dispatch, getState) => {
    const state = getState();
    const firebaseAuth = select.firebaseAuth(state);
    dispatch(firebaseLoad('big'));
    firebaseAuth.signInWithEmailAndPassword(email.trim(), password).then(user => {
      const firebaseData = select.firebaseData(state);
      return firebaseData.ref(`users/${user.uid}`).once('value')
        .then(res => {
          dispatch(goTo('Main'));
          dispatch(firebaseLoginSuccess(res.val()));
        });
    })
    .catch((err) => {
      dispatch(firebaseError(err));
      Alert.alert(
          'Login error',
          err.message, [{ text: 'OK' }],
          { cancelable: false },
      );
    });
  };
}

export function createUserWithEmailAndPassword(email, password) {
  return (dispatch, getState) => {
    const state = getState();
    const firebaseAuth = select.firebaseAuth(state);
    dispatch(firebaseLoad('big'));
    firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(firebaseLoginSuccess());
        dispatch(goTo('Main'));
      })
      .catch((err) => {
        dispatch(firebaseError(err));
        Alert.alert(
          'Login error',
          err.message, [{ text: 'OK' }],
          { cancelable: false },
        );
      });
  };
}

export const logOut = () => (dispatch, getState) => {
  const state = getState();
  const firebaseAuth = select.firebaseAuth(state);
  firebaseAuth.signOut().then(() => {
    dispatch(goTo('Login'));
  }, (error) => {
    dispatch(firebaseError(error));
  });
  // todo: delete session
};
