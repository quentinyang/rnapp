'use strict';

import * as types from '../constants/SignIn';
import {signInfoService} from '../service/signInService';
import {makeActionCreator, serviceAction} from './base';

export const signInfoFetched = makeActionCreator(types.SIGN_INFO_FETCHED, 'info');

export function fetchSignInfo(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: signInfoService,
            data: params,
            success: function(oData) {
                dispatch(signInfoFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

