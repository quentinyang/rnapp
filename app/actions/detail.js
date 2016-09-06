'use strict';

import {Platform} from 'nuke'
import Toast from 'react-native-root-toast';
let CallModule = require('react-native').NativeModules.CallModule;
let AudioPlayer = require('react-native').NativeModules.RNAudioPlayer;
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import * as homeTypes from '../constants/Home';
import * as types from '../constants/DetailType';

import { InteractionManager } from 'nuke'
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';
import { getBaseInfoService, callSellerPhone, postFeedback, getContactLogService, getUserInfoService, getSellerPhoneService, getPropertyRecordService } from '../service/detailService';
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

export const userInfoFetched = makeActionCreator(types.USER_INFO_FETCHED, 'userInfo');
export const couponFetched = makeActionCreator(types.COUPON_FETCHED, 'coupon');
export const updateCoupon = makeActionCreator(types.UPDATE_COUPON, 'id');
export const setCouponVisible = makeActionCreator(types.COUPON_VISIBLE_CHANGED, 'visible');
export const setSellerPhoneVisible = makeActionCreator(types.SELLERPHONE_VISIBLE_CHANGED, 'visible');

export const setEnterStatus = makeActionCreator(types.ENTER_STATUS_CHANGED, 'status');
export const setVoiceVisible = makeActionCreator(types.VOICE_VISIBLE_CHANGED, 'visible');
export const setOrderId = makeActionCreator(types.SET_ORDER_ID, 'id');
export const setCallTipVisibel = makeActionCreator(types.CALL_TIP_VISIBLE_CHANGED, 'visible');
export const propertyRecordFetched = makeActionCreator(types.PROPERTY_RECORD_FETCHED, 'record');
export const updatePayedStatus = makeActionCreator(types.UPDATE_PAYED_STATUS, 'status');

export function fetchBaseInfo(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getBaseInfoService,
            data: data,
            success: function(oData) {
                dispatch(houseBaseFetched(oData));

                if (!Number(oData.is_reply)) {
                    dispatch(setOrderId(oData.log_id));
                    ActionUtil.setAction(actionType.BA_DETAIL_SPEND_ONVIEW);
                    dispatch(setFeedbackVisible(true));
                }

                if (Number(oData.is_paid)) {
                    dispatch(updatePayedStatus(true));
                }

                if(!oData.record_url.length) {
                    ActionUtil.setAction(actionType.BA_DETAIL_PHONE);
                } else {
                    ActionUtil.setActionWithExtend(actionType.BA_DETAIL_TAPE, {"is_verify": oData.is_verify || "0"})
                }

                let key = common.USER_ENTER_STATUS + guid;
                AsyncStorageComponent.get(key)
                .then((value) => {
                    if(!value && oData.record_url && oData.record_url.record_url) {
                        ActionUtil.setAction(actionType.BA_DETAIL_TAPE_REMIND_ONVIEW);
                        dispatch(setEnterStatus(false));
                        AsyncStorageComponent.save(key, "true").catch((error) => {console.log(error);})
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },
            error: function (oData) {

            }
        })
    }
}

export function fetchSimilarHouseList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchSimilarHouseListService,
            data: params,
            success: function (oData) {
                dispatch(houseSimilarFetched(oData))
            },
            error: function (oData) {

            }
        })
    }
}

export function callSeller(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: callSellerPhone,
            data: params,
            loading: true,
            success: function (oData) {
                dispatch(setOrderId(oData.wash_id));
                dispatch(setHomeContactStatus({"property_id": params.property_id, "is_contact": "1"}));
                dispatch(setContactStatus({"property_id": params.property_id, "is_contact": "1"}));
                params.card_id && dispatch(updateCoupon(params.card_id));
                dispatch(updatePayedStatus(true));

                //oData 拿到短号, 直接拨出
                if (Platform.OS == "android") {
                    CallModule.callUp(oData.main_number + ",,," + oData.short_number);
                } else {
                    callUp(oData.main_number + "," + oData.short_number);
                }
            },
            error: function (error) {
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
            loading: true,
            success: function (oData) {
                 dispatch(setFeedbackVisible(false));
                dispatch(setSellerPhone(oData));

                Toast.show('看房获得' + (oData.experience || 10) + '个经验', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                ActionUtil.setActionWithExtend(actionType.BA_DETAIL_EXPERIENCE_ONVIEW, {"vpid": propertyId});
            },
            error: function (error) {
                dispatch(setFeedbackVisible(false));
                dispatch(callSellerFailed(error));
                dispatch(setErrorTipVisible(true));
            }
        })
    }
}

export function fetchContactLog(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getContactLogService,
            data: params,
            success: function (oData) {
                dispatch(houseContactLogFetched(oData))
            },
            error: function (oData) {

            }
        })
    }
}

export function fetchAppendContactLog(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getContactLogService,
            data: params,
            success: function (oData) {
                dispatch(contactLogAppendFetched(oData))
            },
            error: function (oData) {

            }
        })
    }
}

export function fetchUserInfo(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getUserInfoService,
            data: data,
            success: function (oData) {
                dispatch(userInfoFetched(oData));
            },
            error: function (oData) {

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
            loading: true,
            success: function (oData) {
                dispatch(setSellerPhone(oData));
                ActionUtil.setAction(actionType.BA_DETAIL_PHENO_ONVIEW);
                dispatch(setSellerPhoneVisible(true));
                data.card_id && dispatch(updateCoupon(data.card_id));

                dispatch(setHomeContactStatus({"property_id": data.property_id, "is_contact": "1"}));
                dispatch(setContactStatus({"property_id": data.property_id, "is_contact": "1"}));
            },
            error: function (error) {
                dispatch(callSellerFailed(error));
                dispatch(setErrorTipVisible(true));
            }
        })
    }
}

export function fetchPropertyRecord(data) {
    return dispatch => {
        serviceAction(dispatch)({
            service: getPropertyRecordService,
            data: data,
            success: function (oData) {
                if(oData.record_url) {
                    ActionUtil.setAction(actionType.BA_DETAIL_TAPEFREE_ONVIEW);
                    dispatch(setVoiceVisible(true));
                    dispatch(propertyRecordFetched(oData));
                    AudioPlayer.stop();
                    AudioPlayer.play(oData.record_url);
                } else {
                    Toast.show('录音生成中，请稍等一会儿', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER
                    });
                }
            },
            error: function (error) {
                //dispatch(callSellerFailed(error));
                //dispatch(setErrorTipVisible(true));
            }
        })
    }
}