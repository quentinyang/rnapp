'use strict';

import * as types from '../constants/Withdraw';
import {makeActionCreator, serviceAction} from './base';
import { getUserAlipayStatus } from '../service/userService';

export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');
export const alipayStatusFetched = makeActionCreator(types.ALIPAY_FETCHED, 'aliInfo');
export const realNameChanged = makeActionCreator(types.REAL_NAME_CHANGED, 'real_name');
export const priceCleared = makeActionCreator(types.PRICE_CLEARED);
export const errMsg = makeActionCreator(types.WITHDRAW_ERR_MSG, 'err_msg');
export const modalHidden = makeActionCreator(types.MODAL_HIDDEN);
export const fromUserFetched = makeActionCreator(types.FROM_USER_FETCHED, 'account', 'has_bound');

export function getAlipayStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getUserAlipayStatus,
            success: function(oData) {
                dispatch(alipayStatusFetched(oData));
            },
            error: function() {

            }
        })
    }
}
