// import { select } from 'redux/reducers';

export const users = () => 'users';
export const user = userId => () => `${users()}/${userId}`;
export const events = () => 'events';
export const event = eventId => () => `${events()}/${eventId}`;
export const announcements = () => 'announcements';
