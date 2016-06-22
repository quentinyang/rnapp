'use strict';

import * as types from '../constants/BindAlipay';
import {makeActionCreator, serviceAction} from './base';
import { getUserAlipayStatus } from '../service/userService';

export const alipayNameChanged = makeActionCreator(types.ALIPAY_NAME_CHANGED, 'name');
export const alipayStatusFetched = makeActionCreator(types.ALIPAY_FETCHED, 'account', 'has_bound');
export const alipayErrMsg = makeActionCreator(types.ALIPAY_ERR_MSG, 'err_msg');
export const bindStepChanged = makeActionCreator(types.BIND_STEP_CHANGED, 'step');

export function getAlipayStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getUserAlipayStatus,
            success: function(oData) {
                if(oData.is_binding_alipay == 0) {
                    dispatch(bindStepChanged(2));
                } else {
                    dispatch(bindStepChanged(3));
                }
                dispatch(alipayStatusFetched(oData.alipay_accout, oData.is_binding_alipay));
            },
            error: function() {

            }
        })
    }
}