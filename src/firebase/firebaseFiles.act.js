import { select } from 'redux/reducers';
import {
  firebaseError,
} from './firebase.act';

export const firebaseUploadFile = (file, ref, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const firebaseStorage = select.firebaseStorage(state);
    const metadata = {
      contentType: file.type,
      fileName: file.name,
      fileSize: file.size,
    };
    firebaseStorage.ref().child(ref).put(file, metadata)
      .then(callback)
      .catch(err => dispatch(firebaseError(err)));
  };


export const firebaseGetFileUrl = (fileRef, callback) =>
  (dispatch, getState) => {
    const state = getState();
    const localFileUrl = select.firebaseFileByRef(state, fileRef);
    if (localFileUrl) {
      callback(localFileUrl);
    } else {
      const firebaseStorage = select.firebaseStorage(state);
      firebaseStorage.ref().child(fileRef).getDownloadURL()
        .then(url => callback(url))
        .catch(err => dispatch(firebaseError(err)));
    }
  };

