import { select } from 'redux/reducers';

export const drinksRef = () => 'drinks';
export const drinkRef = id => () => `${drinksRef()}/${id}`;
export const userDrinksRef = state => `${drinksRef()}OfUser${select.currentUser(state).uid}`;
export const usersDrinkRef = id => state =>
  `${userDrinksRef(state)}/${id}`;

export const drinksInfosRef = () => 'drinkInfos';
export const drinkInfosRef = id => () => `${drinksInfosRef()}/${id}`;
export const drinkInfosByUserRef = id => state =>
  `${drinkInfosRef(id)()}/${select.currentUser(state).uid}`;
