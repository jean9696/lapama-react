import fGetOr from 'lodash/fp/getOr';
import fHas from 'lodash/fp/has';
import fGet from 'lodash/fp/get';
import {
  FIREBASE_LOAD,
  FIREBASE_LOGIN_SUCESS,
  FIREBASE_ERROR,
  FIREBASE_READ_SUCCESS,
  FIREBASE_CREATE_SUCCESS,
  FIREBASE_UPDATE_SUCCESS,
  FIREBASE_SAVE_LOCAL_FILE,
  FIREBASE_SUBSCRIBE,
  FIREBASE_UNSUBSCRIBE,
} from 'redux/actionTypes';
import { insertObjectInCollection } from './firebaseHelpers';

export default (state = {}, action) => {
  switch (action.type) {
    case FIREBASE_LOAD: {
      return {
        ...state,
        loadType: action.loadType,
      };
    }
    case FIREBASE_LOGIN_SUCESS: {
      return {
        ...state,
        userInfos: action.userInfos,
        loadType: null,
      };
    }
    case FIREBASE_ERROR: {
      console.log('ERROR:', action.error); //eslint-disable-line
      return {
        ...state,
        loadType: null,
      };
    }
    case FIREBASE_READ_SUCCESS: {
      return {
        ...state,
        collections: {
          ...state.collections,
          ...insertObjectInCollection(action.ref, state.collections, action.collection),
        },
      };
    }
    case FIREBASE_CREATE_SUCCESS: {
      const entityRef = `${action.ref}/${action.entity.id}`;
      return {
        ...state,
        collections: {
          ...state.collections,
          ...insertObjectInCollection(entityRef, state.collections, action.collection),
        },
      };
    }
    case FIREBASE_SAVE_LOCAL_FILE: {
      return {
        ...state,
        files: {
          ...state.files,
          [action.ref]: action.uri,
        },
      };
    }
    case FIREBASE_UPDATE_SUCCESS: {
      const updates = Object.keys(action.entities)
        .reduce((context, key) =>
          insertObjectInCollection(key, context, {
            id: key,
            ...action.entities[key],
          }), state.collections,
        );
      return {
        ...state,
        collections: {
          ...state.collections,
          ...updates,
        },
      };
    }
    case FIREBASE_SUBSCRIBE: {
      return {
        ...state,
        subscriptions: {
          ...(state.subscriptions || {}),
          [action.ref]: fGetOr(0, `subscriptions["${action.ref}"]`)(state) + 1,
        },
      };
    }
    case FIREBASE_UNSUBSCRIBE: {
      const subscriptionCount = fGetOr(1, `subscriptions["${action.ref}"]`)(state) - 1;
      if (subscriptionCount < 1) {
        state.app.database().ref(action.ref).off();
      }
      return {
        ...state,
        subscriptions: {
          ...(state.subscriptions || {}),
          [action.ref]: subscriptionCount,
        },
      };
    }
    default:
      return state;
  }
};

const refAsObjectPath = ref => ref.split('/').join('.');


const firebaseAuth = state => state.app.auth();
const currentUser = state => state.app.auth().currentUser;
const firebaseData = state => state.app.database();
const firebaseStorage = state => state.app.storage();
const firebaseApp = state => state.app;
const firebaseLoad = state => state.loadType;
const firebaseCollectionByRef = (state, ref) =>
  fGetOr({}, `collections.${refAsObjectPath(ref)}`)(state);
const firebaseCollectionByRefIsInitilized = (state, ref) =>
  fHas(`collections.${refAsObjectPath(ref)}`)(state);
const firebaseFileByRef = (state, ref) => fGet(`files['${ref}']`)(state);
const userInfos = state => state.userInfos;


export const selectors = {
  firebaseApp,
  firebaseAuth,
  firebaseLoad,
  firebaseData,
  firebaseStorage,
  currentUser,
  firebaseCollectionByRef,
  firebaseCollectionByRefIsInitilized,
  firebaseFileByRef,
  userInfos,
};
