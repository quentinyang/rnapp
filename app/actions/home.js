'use strict';

import * as types from '../constants/Home';
import {fetchAttentionHouseListService, fetchAttentionAppendHouseListService, fetchAttentionPrependHouseListService, fetchHouseNewCountService} from '../service/houseListService';
import {fetchAttentionBlockAndCommunityService} from '../service/blockService';
import {fetchScoreModalStatusService, getGiftInfo, fetchRuleStatusService} from '../service/userService'
import {fetchCouponStatusService} from '../service/cardService';
import {makeActionCreator, serviceAction} from './base';

export const houseAttentionFetched = makeActionCreator(types.HOUSE_ATTENTION_FETCHED, 'houseList');
export const houseAttentionAppendFetched = makeActionCreator(types.HOUSE_ATTENTION_APPEND_FETCHED, 'houseList');
export const houseAttentionPrependFetched = makeActionCreator(types.HOUSE_ATTENTION_PREPEND_FETCHED, 'houseList');
export const clearHomePage = makeActionCreator(types.CLEAR_HOME_PAGE);

export const setScoreModalVisible = makeActionCreator(types.SCORE_MODAL_VISIBLE_CHANGED, 'visible');
export const scoreModalStatusFetched = makeActionCreator(types.SCORE_MODAL_STATUS, 'status');
export const setCouponModalVisible = makeActionCreator(types.COUPON_MODAL_VISIBLE_CHANGED, 'visible');
export const couponModalStatusFetched = makeActionCreator(types.COUPON_MODAL_STATUS, 'status');
export const setRuleModalVisible = makeActionCreator(types.RULE_MODAL_VISIBLE_CHANGED, 'visible');
export const ruleModalStatusFetched = makeActionCreator(types.RULE_MODAL_STATUS, 'status');
export const setRuleShowVisible = makeActionCreator(types.RULE_MODAL_SHOW, 'visible');
export const setGiftModalVisible = makeActionCreator(types.GIFT_MODAL_VISIBLE_CHANGED, 'visible');
export const giftModalStatusFetched = makeActionCreator(types.GIFT_MODAL_STATUS, 'status');
export const setGiftShowVisible = makeActionCreator(types.GIFT_MODAL_SHOW, 'visible');

export const attentionBlockAndCommunityFetched = makeActionCreator(types.ATTENTION_BLOCK_COMMUNITY_FETCHED, 'attentionList');
export const HouseNewCount = makeActionCreator(types.HOUSE_NEW_COUNT, 'count');

//home / list / detail same community
export const setHomeContactStatus = makeActionCreator(types.SET_CONTACT_STATUS, 'contactStatus'); //{property_id: 1}
export const setLookStatus = makeActionCreator(types.SET_LOOK_STATUS, 'lookStatus');

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
//注册领积分
export function fetchScoreModalStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchScoreModalStatusService,
            success: function(oData) {
                dispatch(scoreModalStatusFetched({
                    visible: Number(oData.is_notify) ? true : false,
                    score: oData.point || 8
                }))

                if(!Number(oData.is_notify)) {
                    dispatch(setCouponModalVisible(true));
                }
            },
            error: function(oData) {
            }
        })
    }
}
//送看房卡
export function fetchCouponModalStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchCouponStatusService,
            success: function(oData) {
                oData.visible = oData.get('id') ? true : false;                
                dispatch(couponModalStatusFetched(oData))

                if(!oData.visible) {
                    dispatch(setRuleModalVisible(true));
                }
            },
            error: function(oData) {
            }
        })
    }
}
//发房规则
export function fetchRuleModalStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchRuleStatusService,
            success: function(oData) {
                dispatch(ruleModalStatusFetched({
                    visible: true,
                    score: oData.point || 8
                }))

                if(!Number(oData.is_notify)) {
                    //dispatch(setGiftModalVisible(true));
                }
            },
            error: function(oData) {
            }
        })
    }
}

export function fetchHouseNewCount() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchHouseNewCountService,
            success: function(oData) {
                dispatch(HouseNewCount(oData.count))
            },
            error: function(oData) {
            }
        })
    }
}

export function fetchGiftInfo() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getGiftInfo,
            success: function(oData) {
                dispatch(giftModalStatusFetched(oData));
            },
            error: function() {}
        })
    }
}