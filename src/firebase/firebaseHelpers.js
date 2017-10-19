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

export const generateUUID = () => {
  const d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0; //eslint-disable-line
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); //eslint-disable-line
  });
};
