'use strict';

import * as types from '../constants/Authentication';
import {getAuthenticationService, sendAuthenticationService} from '../service/userService';
import {fetchAttentionBlockSetService} from '../service/blockService';
import {makeActionCreator, serviceAction} from './base';
import {verifiedStatusChanged} from './app';

export const autFetched = makeActionCreator(types.AUT_FETCHED, 'data');
export const allBlockFetched = makeActionCreator(types.ALL_BLOCK_FETCHED, 'data');
export const realNameChanged = makeActionCreator(types.REAL_NAME_CHANGED, 'name');
export const IDCardNumChanged = makeActionCreator(types.ID_CARD_NUM_CHANGED, 'identity_card_number');
export const workAddrChanged = makeActionCreator(types.WORK_ADDRESS_CHANGED, 'data');
export const businessIdChanged = makeActionCreator(types.BUSINESS_ID_CHANGED, 'business_card_id');
export const identityIdChanged = makeActionCreator(types.IDENTITY_ID_CHANGED, 'identity_card_id');
export const businesscardUrlChanged = makeActionCreator(types.BUSINESS_CARD_CHANGED, 'business_card_url');
export const idcardUrlChanged = makeActionCreator(types.IDENTITY_CARD_CHANGED, 'identity_card_url');
export const addrPickerChanged = makeActionCreator(types.ADDR_PICKER_CHANGED, 'visible');
export const autErrMsgChanged = makeActionCreator(types.AUT_ERRMSG_CHANGED, 'err_msg');
export const autSubmitModalChanged = makeActionCreator(types.AUT_SUBMIT_MODAL_CHANGED, 'submit_modal_visible');
export const autInfoCleared = makeActionCreator(types.AUT_INFO_CLEARED);

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export function submitAuthentication(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: sendAuthenticationService,
            data: params,
            success: function () {
                ActionUtil.setAction(actionType.BA_IDENTITY_SUBMIT_SUCCESS);
                dispatch(autSubmitModalChanged(true));
                dispatch(verifiedStatusChanged("1"));
            },
            error: function (err) {
                ActionUtil.setActionWithExtend(actionType.BA_IDENTITY_SUBMIT_ERROR, {"error_type": err.msg || ""});
                dispatch(autErrMsgChanged(err.msg));
            }
        });
    }
}

export function fetchAllBlock() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionBlockSetService,
            success: function(oData) {
                dispatch(allBlockFetched(oData))
            },
            error: function(oData) {
            }
        })
    }
}

export function getAuthentication() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getAuthenticationService,
            success: function (data) {
                dispatch(autFetched(data));
                if(data.business_card_url) {
                    dispatch(autErrMsgChanged('您的身份认证失败，请修改后再提交'));
                }
            },
            error: function (err) {
                dispatch(autErrMsgChanged(err.msg));
            }
        });

    }
}