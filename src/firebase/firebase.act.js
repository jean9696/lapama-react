import {
  FIREBASE_LOGIN_SUCESS,
  FIREBASE_ERROR,
  FIREBASE_LOAD,
  FIREBASE_CREATE_SUCCESS,
  FIREBASE_READ_SUCCESS,
  FIREBASE_UPDATE_SUCCESS,
  FIREBASE_DELETE_SUCCESS,
  FIREBASE_SAVE_LOCAL_FILE,
  FIREBASE_UNSUBSCRIBE,
  FIREBASE_SUBSCRIBE,
} from 'redux/actionTypes';

export function firebaseLoad(loadType) {
  return {
    type: FIREBASE_LOAD,
    loadType,
  };
}

export function firebaseLoginSuccess(userInfos) {
  return {
    type: FIREBASE_LOGIN_SUCESS,
    userInfos,
  };
}

export function firebaseError(error) {
  console.log(error)//eslint-disable-line
  return {
    type: FIREBASE_ERROR,
    error,
  };
}

export function firebaseCreateSuccess(entity, ref) {
  return {
    type: FIREBASE_CREATE_SUCCESS,
    entity,
    ref,
  };
}

export function firebaseReadSuccess(ref, collection) {
  return {
    type: FIREBASE_READ_SUCCESS,
    collection,
    ref,
  };
}

export function firebaseUpdateSuccess(entities) {
  return {
    type: FIREBASE_UPDATE_SUCCESS,
    entities,
  };
}

export function firebaseDeleteSuccess(entityId) {
  return {
    type: FIREBASE_DELETE_SUCCESS,
    entityId,
  };
}

export function firebaseAddSubscription(ref) {
  return {
    type: FIREBASE_SUBSCRIBE,
    ref,
  };
}

export function firebaseRemoveSubscription(ref) {
  return {
    type: FIREBASE_UNSUBSCRIBE,
    ref,
  };
}


export function firebaseSaveLocalFile(ref, uri) {
  return {
    type: FIREBASE_SAVE_LOCAL_FILE,
    ref,
    uri,
  };
}
