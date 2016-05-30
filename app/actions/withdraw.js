'use strict';

import * as types from '../constants/Withdraw';
import {makeActionCreator, serviceAction} from './base';
import { getUserAlipayAccount } from '../service/userService';

export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');
export const alipayAccountFetched = makeActionCreator(types.ALIPAY_FETCHED, 'account');
export const priceCleared = makeActionCreator(types.PRICE_CLEARED);
export const errMsg = makeActionCreator(types.WITHDRAW_ERR_MSG, 'err_msg');

export function getAlipayAccount() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getUserAlipayAccount,
            success: function(oData) {
                dispatch(alipayAccountFetched(oData.account));
            },
            error: function() {

            }
        })
    }
}
