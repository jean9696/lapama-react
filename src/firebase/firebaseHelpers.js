import fSet from 'lodash/fp/set';

export const insertFirebaseKeys = collection =>
  (collection ? Object.keys(collection).reduce((context, key) => ({
    [key]: {
      id: key,
      ...collection[key],
    },
    ...context,
  }), {}) : {});

export const insertObjectInCollection = (ref, collections, object) =>
  fSet(ref.split('/'), object)(collections);
