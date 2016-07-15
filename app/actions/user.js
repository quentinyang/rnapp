'use strict';

import * as types from '../constants/User';
import {profileService, scoreListService, expRuleService, userInputListService, getSignInInfo} from '../service/userService';
import {makeActionCreator, serviceAction} from './base';

export const userProfileFetched = makeActionCreator(types.USER_PROFILE, 'profile');
export const scoreFetched = makeActionCreator(types.SCORE_LIST, 'scores');
export const scoreCleared = makeActionCreator(types.SCORE_CLEARED);
export const setBindPromptVisible = makeActionCreator(types.BIND_VISIBLE_CHANGED, 'visible');
//我的等级
export const expRuleFetched = makeActionCreator(types.EXP_RULE, 'expRule');

export const userInputHouseFetched = makeActionCreator(types.USER_INPUT_HOUSE_FETCHED, 'data');
export const userInputHouseCleared = makeActionCreator(types.USER_INPUT_HOUSE_CLEARED);

//签到
export const signInFetched = makeActionCreator(types.SIGN_IN_FETCHED, 'info');
export const signInVisibleChanged = makeActionCreator(types.SIGN_IN_VISIBLE_CHANGED, 'visible');
export const signInBtnVisibleChanged = makeActionCreator(types.SIGN_IN_BUTTON_VISIBLE_CHANGED, 'visible');

export function fetchUserProfile(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: profileService,
            data: params,
            success: function(oData) {
                oData.hasSignIn = true;
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

//获取用户发布房源列表
export function fetchUserInputHouse(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: userInputListService,
            data: params,
            success: function(oData) {
                dispatch(userInputHouseFetched(oData))
            },
            error: function() {
            }
        })
    }
}

export function fetchSignInInfo() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getSignInInfo,
            success: function (oData) {
                dispatch(signInFetched(oData));
                dispatch(signInVisibleChanged(true));
            },
            error: function () {
            }
        })
    }
}
