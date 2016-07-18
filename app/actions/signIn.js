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
                for(var i = 0; i < oData.future_welfare_cards.length; i++) {
                    for(var j = 0; j < oData.future_welfare_cards[i].welfare_cards.length; j++) {
                        oData.future_welfare_cards[i].welfare_cards[j].status = 1;
                    }
                }
                dispatch(signInfoFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

