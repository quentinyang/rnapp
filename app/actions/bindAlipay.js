'use strict';

import * as types from '../constants/BindAlipay';
import {makeActionCreator, serviceAction} from './base';
import { getAlipayStatusService } from '../service/payService';

export const alipayNameChanged = makeActionCreator(types.ALIPAY_NAME_CHANGED, 'name');
export const alipayIDCardChanged = makeActionCreator(types.ALIPAY_IDCard_CHANGED, 'identity_card_number');
export const alipayStatusFetched = makeActionCreator(types.ALIPAY_FETCHED, 'account', 'has_bound');
export const alipayErrMsg = makeActionCreator(types.ALIPAY_ERR_MSG, 'err_msg');
export const bindStepChanged = makeActionCreator(types.BIND_STEP_CHANGED, 'step');

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export function getAlipayStatus(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getAlipayStatusService,
            data: params,
            success: function(oData) {
                dispatch(alipayStatusFetched(oData.alipay_account, oData.other_binding));
                if(oData.other_binding == 0) {
                    ActionUtil.setAction(actionType.BA_MINE_ZHIFUBAO_NAMEONVIEW);
                    dispatch(bindStepChanged(2));
                } else if(oData.other_binding == 1) {
                    ActionUtil.setAction(actionType.BA_MINE_ZHIFUBAO_EXISTONVIEW);
                    dispatch(bindStepChanged(3));
                }
            },
            error: function() {

            }
        })
    }
}