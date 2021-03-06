import * as types from '../constants/Login';
import {login} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const phoneChanged = makeActionCreator(types.PHONE_CHANGED, 'phone');
export const codeChanged = makeActionCreator(types.CODE_CHANGED, 'code');
export const formSubmitted = makeActionCreator(types.FORM_SUBMITTED, 'login_form');

export const codeStatus = makeActionCreator(types.CSTATUS_CHANGED, 'code_status');
export const codeSend = makeActionCreator(types.CSEND_CHANGED, 'code_send');
export const numChanged = makeActionCreator(types.NUM_CHANGED, 'num');
export const errMsg = makeActionCreator(types.ERR_MSG, 'err_msg');

export const loginCleared = makeActionCreator(types.LOGIN_CLEARED);
export const userDataFetched = makeActionCreator(types.USER_DATA_FETCHED, 'data');