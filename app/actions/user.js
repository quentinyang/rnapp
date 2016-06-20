'use strict';

import * as types from '../constants/User';
import {profileService, scoreListService, expRuleService} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const userProfileFetched = makeActionCreator(types.USER_PROFILE, 'profile');
export const scoreFetched = makeActionCreator(types.SCORE_LIST, 'scores');
export const scoreCleared = makeActionCreator(types.SCORE_CLEARED);
//我的等级
export const expRuleFetched = makeActionCreator(types.EXP_RULE, 'expRule');

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

export function fetchExpLevel() {
    return dispatch => {
        serviceAction(dispatch)({
            service: expRuleService,
            success: function(oData) {
                dispatch(expRuleFetched(oData))
            },
            error: function() {
            }
        })
    }
}
