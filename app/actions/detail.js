'use strict';

import * as types from '../constants/DetailType';
import { InteractionManager } from 'nuke'
import { getBaseInfoService, getStatusService, callSellerPhone, postFeedback } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');
export const houseBaseFetched = makeActionCreator(types.HOUSE_BASE_FETCHED, 'houseBase');
export const houseStatusFetched = makeActionCreator(types.HOUSE_STATUS_FETCHED, 'houseStatus');

export const setScoreTipVisible = makeActionCreator(types.SCORE_TIP_VISIBLE_CHANGED, 'visible');
export const setErrorTipVisible = makeActionCreator(types.ERROR_TIP_VISIBLE_CHANGED, 'visible');
export const setFeedbackVisible = makeActionCreator(types.FEEDBACK_VISIBLE_CHANGED, 'visible');
export const setSellerPhone = makeActionCreator(types.SET_SELLER_PHONE, 'phone');
export const callSellerSuccess = makeActionCreator(types.CALL_SELLER_SUCCESS, 'logId');
export const callSellerFailed = makeActionCreator(types.CALL_SELLER_FAILED, 'callError');

export function fetchBaseInfo(data) {
    return dispatch => {
        return getBaseInfoService(data)
             .then((oData) => {
                 dispatch(houseBaseFetched(oData))
             })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchSimilarHouseList(params) {
    return dispatch => {
        return fetchSimilarHouseListService(params)
            .then((oData) => {
                dispatch(houseSimilarFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function fetchHouseStatus(params) {
    return dispatch => {
        return getStatusService(params)
            .then((oData) => {
                dispatch(houseStatusFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ', error);
            })
    }
}

export function callSeller(params) {
    return dispatch => {
        return callSellerPhone(params)
            .then((oData) => {
                console.info('call seller Ajax Success: ', oData);
                dispatch(setScoreTipVisible(false));
                dispatch(callSellerSuccess(oData.log_id));

                InteractionManager.runAfterInteractions(() => {
                    setTimeout(() => {
                        dispatch(setFeedbackVisible(true));
                    }, 4000);
                });
            })
            .catch((error) => {
                dispatch(setScoreTipVisible(false));
                dispatch(setErrorTipVisible(true));
                dispatch(callSellerFailed(error))
            })
    }
}

export function callFeedback(params) {
    return dispatch => {
        return postFeedback(params)
            .then((oData) => {
                console.info('feedback Ajax Success: ', oData);
                dispatch(setFeedbackVisible(false));
                dispatch(setSellerPhone(oData.seller_phone));
            })
            .catch((error) => {

            })
    }
}