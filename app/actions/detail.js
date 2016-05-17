'use strict';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import * as homeTypes from '../constants/Home';
import * as types from '../constants/DetailType';

import { InteractionManager } from 'nuke'
import { getBaseInfoService, getStatusService, callSellerPhone, postFeedback } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import {makeActionCreator, serviceAction} from './base';

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');
export const houseBaseFetched = makeActionCreator(types.HOUSE_BASE_FETCHED, 'houseBase');
export const clearHouseDetailPage = makeActionCreator(types.CLEAR_HOUSE_DETAIL_PAGE);
export const houseStatusFetched = makeActionCreator(types.HOUSE_STATUS_FETCHED, 'houseStatus');
export const setScoreTipVisible = makeActionCreator(types.SCORE_TIP_VISIBLE_CHANGED, 'visible');
export const setErrorTipVisible = makeActionCreator(types.ERROR_TIP_VISIBLE_CHANGED, 'visible');
export const setFeedbackVisible = makeActionCreator(types.FEEDBACK_VISIBLE_CHANGED, 'visible');
export const setSellerPhone = makeActionCreator(types.SET_SELLER_PHONE, 'phone');
export const callSellerSuccess = makeActionCreator(types.CALL_SELLER_SUCCESS, 'logId');
export const callSellerFailed = makeActionCreator(types.CALL_SELLER_FAILED, 'callError');

//home / list / detail same community
export const setContactStatus = makeActionCreator(homeTypes.SET_CONTACT_STATUS, 'contactStatus'); //{property_id: 1}
export const setLookStatus = makeActionCreator(homeTypes.SET_LOOK_STATUS, 'lookStatus');

export function fetchBaseInfo(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getBaseInfoService,
            data: data,
            success: function(oData) {
                if(!Number(oData.is_reply)) {
                    dispatch(callSellerSuccess(oData.log_id));
                    dispatch(setFeedbackVisible(true));
                }

                dispatch(houseBaseFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchSimilarHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchSimilarHouseListService,
            data: params,
            success: function(oData) {
                dispatch(houseSimilarFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchHouseStatus(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getStatusService,
            data: params,
            success: function(oData) {
                dispatch(houseStatusFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function callSeller(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: callSellerPhone,
            data: params,
            success: function(oData) {
                ActionUtil.setActionWithExtend(actionType.BA_DETAIL_CALL_SUCCESS, {
                    vpid: params
                });

                dispatch(setScoreTipVisible(false));
                dispatch(callSellerSuccess(oData.log_id));

                InteractionManager.runAfterInteractions(() => {
                    setTimeout(() => {
                        dispatch(setFeedbackVisible(true));
                    }, 5000);
                });
            },
            error: function(error) {
                dispatch(setScoreTipVisible(false));
                dispatch(setErrorTipVisible(true));
                dispatch(callSellerFailed(error))
            }
        })
    }
}

export function callFeedback(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: postFeedback,
            data: params,
            success: function(oData) {
                dispatch(setFeedbackVisible(false));
                dispatch(setSellerPhone(oData.seller_phone));
            },
            error: function(oData) {

            }
        })
    }
}