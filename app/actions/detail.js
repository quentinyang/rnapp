'use strict';

import {Platform} from 'nuke'
import Toast from 'react-native-root-toast';
let CallModule = require('react-native').NativeModules.CallModule;

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import * as homeTypes from '../constants/Home';
import * as types from '../constants/DetailType';

import { InteractionManager } from 'nuke'
import { getBaseInfoService, callSellerPhone, postFeedback, getContactLogService, getUserInfoService, getSellerPhoneService } from '../service/detailService';
import { fetchSimilarHouseListService } from '../service/houseListService';
import { getWelfareList }  from '../service/cardService';
import {makeActionCreator, serviceAction} from './base';
import {callUp} from '../utils/CommonUtils'

import {setHomeContactStatus} from './home'
import {setContactStatus} from './navigation'

export const houseSimilarFetched = makeActionCreator(types.HOUSE_SIMILAR_FETCHED, 'houseList');
export const houseBaseFetched = makeActionCreator(types.HOUSE_BASE_FETCHED, 'houseBase');
export const clearHouseDetailPage = makeActionCreator(types.CLEAR_HOUSE_DETAIL_PAGE);
export const setErrorTipVisible = makeActionCreator(types.ERROR_TIP_VISIBLE_CHANGED, 'visible');
export const setFeedbackVisible = makeActionCreator(types.FEEDBACK_VISIBLE_CHANGED, 'visible');

export const setSellerPhone = makeActionCreator(types.SET_SELLER_PHONE, 'info');
export const callSellerFailed = makeActionCreator(types.CALL_SELLER_FAILED, 'callError');
export const houseContactLogFetched = makeActionCreator(types.HOSUE_CONTACT_LOG, 'contact');
export const contactLogAppendFetched = makeActionCreator(types.APPEND_HOUSE_CONTACT_LOG, 'contact');
export const changeCurrentContactLog = makeActionCreator(types.CHANGE_CURRENT_CONTACT_LOG);
export const setWashId = makeActionCreator(types.SET_WASH_ID, 'washId');

export const userInfoFetched = makeActionCreator(types.USER_INFO_FETCHED, 'userInfo');
export const couponFetched = makeActionCreator(types.COUPON_FETCHED, 'coupon');

export const setCouponVisible = makeActionCreator(types.COUPON_VISIBLE_CHANGED, 'visible');
export const setVoiceVisible = makeActionCreator(types.VOICE_VISIBLE_CHANGED, 'visible');
export const setSellerPhoneVisible = makeActionCreator(types.SELLERPHONE_VISIBLE_CHANGED, 'visible');

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

                dispatch(setHomeContactStatus({"property_id": params.property_id, "is_contact": "1"}));
                dispatch(setContactStatus({"property_id": params.property_id, "is_contact": "1"}));

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

export function callFeedback(params, propertyId) {
    return dispatch => {
        serviceAction(dispatch)({
            service: postFeedback,
            data: params,
            success: function(oData) {                
                dispatch(setSellerPhone({
                    phone: oData.seller_phone || '',
                    exp: oData.experience || 5
                }));

                Toast.show('看房获得' + (oData.experience || 5) + '个经验', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                ActionUtil.setActionWithExtend(actionType.BA_DETAIL_EXPERIENCE_ONVIEW, {"vpid": propertyId});
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

export function fetchUserInfo(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getUserInfoService,
            data: data,
            success: function(oData) {
                dispatch(userInfoFetched(oData));
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchCoupon(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getWelfareList,
            data: data,
            success: function(oData) {
                dispatch(couponFetched(oData.items || []));
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchSellerPhone(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getSellerPhoneService,
            data: data,
            success: function(oData) {
                dispatch(setSellerPhone({
                    phone: oData.seller_phone,
                    exp: oData.experience || 5
                }));
                dispatch(setSellerPhoneVisible(true));
            },
            error: function(error) {
               dispatch(callSellerFailed(error));    
               dispatch(setErrorTipVisible(true));
            }
        })
    }
}