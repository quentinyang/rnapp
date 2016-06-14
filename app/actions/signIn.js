'use strict';

import * as types from '../constants/SignIn';
import {signInStatusService} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const signInfoFetched = makeActionCreator(types.SIGN_INFO_FETCHED, 'info');
export const cleanSignInfo = makeActionCreator(types.CLEAN_SIGN_INFO);

export function fetchSignInfo() {
    return dispatch => {
        serviceAction(dispatch)({
            service: signInStatusService,
            success: function(oData) {
                dispatch(signInfoFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

