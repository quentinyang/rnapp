'use strict';

import * as types from '../constants/Home';
import {fetchAttentionHouseListService, fetchAttentionAppendHouseListService, fetchAttentionPrependHouseListService, fetchHouseNewCountService} from '../service/houseListService';

import {fetchAttentionBlockAndCommunityService,getAttentionStatus} from '../service/blockService';
import {fetchScoreModalStatusService} from '../service/userService'
import {fetchCouponStatusService} from '../service/cardService';
import {fetchRuleStatusService} from '../service/configService';
import {makeActionCreator, serviceAction} from './base';

export const houseAttentionFetched = makeActionCreator(types.HOUSE_ATTENTION_FETCHED, 'houseList');
export const houseAttentionAppendFetched = makeActionCreator(types.HOUSE_ATTENTION_APPEND_FETCHED, 'houseList');
export const houseAttentionPrependFetched = makeActionCreator(types.HOUSE_ATTENTION_PREPEND_FETCHED, 'houseList');
export const clearHomePage = makeActionCreator(types.CLEAR_HOME_PAGE);

export const scoreModalStatusFetched = makeActionCreator(types.SCORE_MODAL_STATUS, 'status');
export const couponModalStatusFetched = makeActionCreator(types.COUPON_MODAL_STATUS, 'status');
export const ruleModalStatusFetched = makeActionCreator(types.RULE_MODAL_STATUS, 'status');

export const currentModalChanged = makeActionCreator(types.CURRENT_MODAL_CHANGED, 'modal');
export const pushShowModal = makeActionCreator(types.PUSH_SHOW_MODAL, 'modal');

export const attentionBlockAndCommunityFetched = makeActionCreator(types.ATTENTION_BLOCK_COMMUNITY_FETCHED, 'attentionList');
export const HouseNewCount = makeActionCreator(types.HOUSE_NEW_COUNT, 'count');
export const HouseCurrentStatus = makeActionCreator(types.HOUSE_CURRENT_STATUS, 'current');

//home / list / detail same community
export const setHomeContactStatus = makeActionCreator(types.SET_CONTACT_STATUS, 'contactStatus'); //{property_id: 1}
export const setLookStatus = makeActionCreator(types.SET_LOOK_STATUS, 'lookStatus');

export function fetchAttentionHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionHouseListService,
            data: params,
            success: function (oData) {
                dispatch(houseAttentionFetched(oData))
            },
            error: function (oData) {
            }
        })

    }
}

export function fetchAttentionAppendHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionAppendHouseListService,
            data: params,
            success: function (oData) {
                dispatch(houseAttentionAppendFetched(oData))
            },
            error: function (oData) {
            }
        })

    }
}

export function fetchAttentionPrependHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionPrependHouseListService,
            data: params,
            success: function (oData) {
                dispatch(houseAttentionPrependFetched(oData))
            },
            error: function (oData) {
            }
        })

    }
}

export function fetchAttentionBlockAndCommunity(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchAttentionBlockAndCommunityService,
            data: params,
            success: function (oData) {
                dispatch(attentionBlockAndCommunityFetched(oData))
            },
            error: function (oData) {
            }
        })

    }
}
//注册领福利卡
export function fetchScoreModalStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchScoreModalStatusService,
            success: function (oData) {
                if (Number(oData.is_notify)) {
                    dispatch(pushShowModal(types.SCORE));
                }

                dispatch(scoreModalStatusFetched({
                    fetched: true,
                    visible: Number(oData.is_notify) ? true : false,
                    welfareArr: oData.welfare_cards || []
                }))
            },
            error: function (oData) {
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
                let rs = {};
                rs.visible = oData.length ? true : false;
                rs.fetched = true;
                rs.welfareArr = oData;
                if (rs.visible) {
                    dispatch(pushShowModal(types.COUPON));
                }
                dispatch(couponModalStatusFetched(rs));
            },
            error: function (oData) {
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
                dispatch(ruleModalStatusFetched(oData))
            },
            error: function (oData) {
            }
        })
    }
}

export function fetchHouseNewCount() {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchHouseNewCountService,
            success: function (oData) {
                dispatch(HouseNewCount(oData.count))
            },
            error: function (oData) {
            }
        })
    }
}

export function fetchCurrentStatus() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getAttentionStatus,
            success: function (oData) {
                dispatch(HouseCurrentStatus(oData.user_set_status))
            },
            error: function (oData) {
            }
        })
    }
}
