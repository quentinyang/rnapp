'use strict';

import * as types from '../constants/Home';
import {fetchAttentionHouseListService, fetchAttentionAppendHouseListService, fetchAttentionPrependHouseListService} from '../service/houseListService';
import {fetchAttentionBlockAndCommunityService} from '../service/blockService';
import {fetchScoreModalStatusService} from '../service/userService'
import {makeActionCreator, serviceAction} from './base';

export const houseAttentionFetched = makeActionCreator(types.HOUSE_ATTENTION_FETCHED, 'houseList');
export const houseAttentionAppendFetched = makeActionCreator(types.HOUSE_ATTENTION_APPEND_FETCHED, 'houseList');
export const houseAttentionPrependFetched = makeActionCreator(types.HOUSE_ATTENTION_PREPEND_FETCHED, 'houseList');
export const clearHomePage = makeActionCreator(types.CLEAR_HOME_PAGE);
export const setScoreModalVisible = makeActionCreator(types.SCORE_MODAL_VISIBLE_CHANGED, 'visible');
export const scoreModalStatusFetched = makeActionCreator(types.SCORE_MODAL_STATUS, 'status');

export const attentionBlockAndCommunityFetched = makeActionCreator(types.ATTENTION_BLOCK_COMMUNITY_FETCHED, 'attentionList');

export function fetchAttentionHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionHouseListService,
            data: params,
            success: function(oData) {
                dispatch(houseAttentionFetched(oData))
            },
            error: function(oData) {
            }
        })
        
    }
}

export function fetchAttentionAppendHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionAppendHouseListService,
            data: params,
            success: function(oData) {
                dispatch(houseAttentionAppendFetched(oData))
            },
            error: function(oData) {
            }
        })
        
    }
}

export function fetchAttentionPrependHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionPrependHouseListService,
            data: params,
            success: function(oData) {
                dispatch(houseAttentionPrependFetched(oData))
            },
            error: function(oData) {
            }
        })
        
    }
}

export function fetchAttentionBlockAndCommunity(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionBlockAndCommunityService,
            data: params,
            success: function(oData) {
                dispatch(attentionBlockAndCommunityFetched(oData))
            },
            error: function(oData) {
            }
        })
        
    }
}

export function fetchScoreModalStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchScoreModalStatusService,
            success: function(oData) {
                console.dir(oData);
                dispatch(scoreModalStatusFetched({
                    visible: Number(oData.is_notify) || false,
                    score: oData.point || 8
                }))
            },
            error: function(oData) {
            }
        })
    }
}