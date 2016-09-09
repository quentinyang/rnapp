'use strict';

import * as types from '../constants/Authentication';
import {getAuthenticationService, sendAuthenticationService} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const realNameChanged = makeActionCreator(types.REAL_NAME_CHANGED, 'name');
export const IDCardNumChanged = makeActionCreator(types.ID_CARD_NUM_CHANGED, 'identity_card_number');
export const workAddrChanged = makeActionCreator(types.WORK_ADDRESS_CHANGED, 'data');
export const businessCardChanged = makeActionCreator(types.BUSINESS_CARD_CHANGED, 'business_card_id');
export const identityCardChanged = makeActionCreator(types.IDENTITY_CARD_CHANGED, 'identity_card_id');
export const addrPickerChanged = makeActionCreator(types.ADDR_PICKER_CHANGED, 'visible');
export const autErrMsgChanged = makeActionCreator(types.AUT_ERRMSG_CHANGED, 'err_msg');
export const autSubmitModalChanged = makeActionCreator(types.AUT_SUBMIT_MODAL_CHANGED, 'submit_modal_visible');

export function submitAuthentication(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: sendAuthenticationService,
            data: params,
            success: function () {
                dispatch(autSubmitModalChanged(true))
            },
            error: function (err) {
                dispatch(autErrMsgChanged(err.msg))
            }
        })

    }
}