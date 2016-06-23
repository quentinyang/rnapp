'use strict';

import * as types from '../constants/BindAlipay';
import {makeActionCreator, serviceAction} from './base';
import { getAlipayStatusService } from '../service/payService';

export const alipayNameChanged = makeActionCreator(types.ALIPAY_NAME_CHANGED, 'name');
export const alipayStatusFetched = makeActionCreator(types.ALIPAY_FETCHED, 'account', 'has_bound');
export const alipayErrMsg = makeActionCreator(types.ALIPAY_ERR_MSG, 'err_msg');
export const bindStepChanged = makeActionCreator(types.BIND_STEP_CHANGED, 'step');

export function getAlipayStatus(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getAlipayStatusService,
            data: params,
            success: function(oData) {
                dispatch(alipayStatusFetched(oData.alipay_account, oData.other_binding));
                if(oData.other_binding == 0) {
                    dispatch(bindStepChanged(2));
                } else if(oData.other_binding == 1) {
                    dispatch(bindStepChanged(3));
                }
            },
            error: function() {

            }
        })
    }
}