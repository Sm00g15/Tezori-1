import { fromJS } from 'immutable';
import { push } from 'react-router-redux';

import actionCreator from '../utils/reduxHelpers';
import request from '../utils/request';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import { createWallet } from '../conseil';

const { DEFAULT } = CREATION_CONSTANTS;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const POST_PASSWORD_URL = '/testing123';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_ADDRESS = 'SET_ADDRESS';
const SET_DISPLAY = 'SET_DISPLAY';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_WALLET_FILENAME = 'SET_WALLET_FILENAME';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setAddress = actionCreator(SET_ADDRESS, 'address');
export const setDisplay = actionCreator(SET_DISPLAY, 'currentDisplay');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const setWalletFileName = actionCreator(
  SET_WALLET_FILENAME,
  'walletFileName'
);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function submitAddress() {
  return async (dispatch, state) => {
    const address = state().walletInitialization.get('address');
    const password = state().walletInitialization.get('password');

    try {
      dispatch(setIsLoading(true));
      console.log('indexing?!?!?!?!');
      const newWallet = await createWallet('./newWallet.json', '123123');
      console.log('newWallet', newWallet);
      await postAddress(password, address);
      dispatch(setDisplay(DEFAULT));
      dispatch(setIsLoading(false));
      dispatch(push('/addresses'));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  address: '',
  currentDisplay: DEFAULT,
  isLoading: false,
  password: '',
  walletFileName: ''
});

export default function walletInitialization(state = initState, action) {
  switch (action.type) {
    case SET_DISPLAY:
      return state.set('currentDisplay', action.currentDisplay);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SET_ADDRESS:
      return state.set('address', action.address);
    case SET_WALLET_FILENAME:
      return state.set('walletFileName', action.walletFileName);
    case SET_PASSWORD:
      return state.set('password', action.password);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function postAddress(password, address) {
  return request(POST_PASSWORD_URL, 'POST', { password, address });
}