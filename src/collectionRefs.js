// import { select } from 'redux/reducers';

export const users = () => 'users';
export const user = userId => () => `${users()}/${userId}`;
