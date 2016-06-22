'use strict';

import * as types from '../constants/Withdraw';
import {makeActionCreator, serviceAction} from './base';
import { getUserAlipayStatus } from '../service/userService';

export const withdrawPriceChanged = makeActionCreator(types.WITHDRAW_PRICE_CHANGED, 'price');
export const aliAccountChanged = makeActionCreator(types.ALIPAY_ACCOUNT_CHANGED, 'alipay_account');
export const withdrawNameChanged = makeActionCreator(types.WITHDRAW_NAME_CHANGED, 'name');
export const withdrawPriceCleared = makeActionCreator(types.WITHDRAW_PRICE_CLEARED);
export const withdrawErrMsg = makeActionCreator(types.WITHDRAW_ERR_MSG, 'err_msg');
export const fromUserFetched = makeActionCreator(types.FROM_USER_FETCHED, 'account', 'has_bound');

export const bindStepChanged = makeActionCreator(types.BIND_STEP_CHANGED, 'step');
