'use strict';

import * as types from '../constants/User';
import {profileService, scoreListService} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const userProfileFetched = makeActionCreator(types.USER_PROFILE, 'profile');
export const scoreFetched = makeActionCreator(types.SCORE_LIST, 'scores');
export const scoreCleared = makeActionCreator(types.SCORE_CLEARED);

export function fetchUserProfile(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: profileService,
            data: params,
            success: function(oData) {
                dispatch(userProfileFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchScoreList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: scoreListService,
            data: params,
            success: function(oData) {
                dispatch(scoreFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}
