'use strict';

import {Platform} from 'nuke'
let CallModule = require('react-native').NativeModules.CallModule;

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import * as homeTypes from '../constants/Home';
import * as types from '../constants/DetailType';

import { InteractionManager } from 'nuke'
import { getBaseInfoService, callSellerPhone, postFeedback, getContactLogService } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import {makeActionCreator, serviceAction} from './base';
import {callUp} from '../utils/CommonUtils'

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');
export const houseBaseFetched = makeActionCreator(types.HOUSE_BASE_FETCHED, 'houseBase');
export const clearHouseDetailPage = makeActionCreator(types.CLEAR_HOUSE_DETAIL_PAGE);
export const setErrorTipVisible = makeActionCreator(types.ERROR_TIP_VISIBLE_CHANGED, 'visible');
export const setFeedbackVisible = makeActionCreator(types.FEEDBACK_VISIBLE_CHANGED, 'visible');
export const setSellerPhone = makeActionCreator(types.SET_SELLER_PHONE, 'phone');
export const callSellerFailed = makeActionCreator(types.CALL_SELLER_FAILED, 'callError');
export const houseContactLogFetched = makeActionCreator(types.HOSUE_CONTACT_LOG, 'contact');
export const contactLogAppendFetched = makeActionCreator(types.APPEND_HOUSE_CONTACT_LOG, 'contact');
export const changeCurrentContactLog = makeActionCreator(types.CHANGE_CURRENT_CONTACT_LOG);
export const setWashId = makeActionCreator(types.SET_WASH_ID, 'washId');

//home / list / detail same community
export const setContactStatus = makeActionCreator(homeTypes.SET_CONTACT_STATUS, 'contactStatus'); //{property_id: 1}
export const setLookStatus = makeActionCreator(homeTypes.SET_LOOK_STATUS, 'lookStatus');

export function fetchBaseInfo(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getBaseInfoService,
            data: data,
            success: function(oData) {
                dispatch(houseBaseFetched(oData));

                if(!Number(oData.is_reply)) {
                    ActionUtil.setAction(actionType.BA_DETAIL_SPEND_ONVIEW);
                    dispatch(setFeedbackVisible(true));
                    dispatch(setWashId(oData.log_id));
                }
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

export function callSeller(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: callSellerPhone,
            data: params,
            success: function(oData) {
                dispatch(setWashId(oData.log_id));
                //oData 拿到短号, 直接拨出
                if(Platform.OS == "android") {
                    CallModule.callUp(oData.main_number + ",,," + oData.short_number);
                }else {
                    callUp(oData.main_number + "," + oData.short_number);
                }
            },
            error: function(error) {
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
                dispatch(setSellerPhone(oData.seller_phone || ''));
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchContactLog(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getContactLogService,
            data: params,
            success: function(oData) {
                dispatch(houseContactLogFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchAppendContactLog(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getContactLogService,
            data: params,
            success: function(oData) {
                dispatch(contactLogAppendFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}