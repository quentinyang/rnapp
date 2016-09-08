'use strict';

import * as types from '../constants/App';
import {makeActionCreator, serviceAction} from './base';
import {setWebStartConfigService, deletePushService, setConfigService, setUserConfigService} from '../service/configService';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');
export const webNetWorkError = makeActionCreator(types.WEB_NETWORK_ERROR, 'msg');
export const webStartConfig = makeActionCreator(types.WEB_START_CONFIG, 'config');
export const appConfig = makeActionCreator(types.APP_CONFIG, 'appConfig');
export const appUserConfig = makeActionCreator(types.APP_USER_CONFIG, 'appUserConfig');
export const closeUpdateModal = makeActionCreator(types.CLOSE_UPDATE_MODAL, 'visible');
export const closeLoginModal = makeActionCreator(types.CLOSE_LOGIN_MODAL, 'visible');
export const clickBackPage = makeActionCreator(types.CLICK_BACK_PAGE, 'pageName');

export const setSearchHistoryKey = makeActionCreator(types.SET_SEARCH_HISTORY_KEY, 'searchHistoryKey');
export const getSearchHistory = makeActionCreator(types.GET_SEARCH_HISTORY, 'searchHistoryValue');
export const addListSearchHistory = makeActionCreator(types.ADD_LIST_SEARCH_HISTORY, 'addItem');
export const addInputSearchHistory = makeActionCreator(types.ADD_INPUT_SEARCH_HISTORY, 'addItem');
export const clearListSearchHistory = makeActionCreator(types.CLEAR_LIST_SEARCH_HISTORY);
export const clearInputSearchHistory = makeActionCreator(types.CLEAR_INPUT_SEARCH_HISTORY);

export const clickTabChanged = makeActionCreator(types.FORBIDDEN_TAB_CHANGED, 'status');

export const appLoadingChanged = makeActionCreator(types.APP_LOADING_CHANGED, 'visible');

export const netWorkChanged = makeActionCreator(types.APP_NETWORK_CHANGED, 'net');  //网络状况改变
export const msgNoticeGeted = makeActionCreator(types.MESSAGE_NOTICE_GETED, 'message');
export const msgNoticeVisibleChanged = makeActionCreator(types.MESSAGE_NOTICE_VISIBLE_CHANGED, 'visible');
export const forceUpdateGeted = makeActionCreator(types.FORCE_UPDATE_GETED);

export const appSignInChanged = makeActionCreator(types.APP_SIGNIN_CHANGED, 'signIn');

export const levelPushed = makeActionCreator(types.LEVEL_PUSHED, 'data');
export const levelModalChanged = makeActionCreator(types.NEW_LEVEL_MODAL_CHANGED, 'visible');

export const verifiedNoticeSet = makeActionCreator(types.VERIFIED_NOTICE_SET, 'data');
export const verifiedNoticeVisibleChanged = makeActionCreator(types.VERIFIED_NOTICE_VISIBLE_CHANGED, 'visible');

export const verifiedResultSet = makeActionCreator(types.VERIFIED_RESULT_SET, 'data');
export const verifiedResultVisibleChanged = makeActionCreator(types.VERIFIED_RESULT_VISIBLE_CHANGED, 'visible');

export function clickBack(name) {
    return dispatch => {
        dispatch(clickBackPage(name));
    }
}

export function setWebStartConfig(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: setWebStartConfigService,
            data: params,
            success: function(oData) {
                dispatch(webStartConfig(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function deletePush() {
    return dispatch => {
        serviceAction(dispatch)({
            service: deletePushService,
            success: function(oData) {
            },
            error: function(oData) {

            }
        })
    }
}

export function setAppConfig() {
    return dispatch => {
        serviceAction(dispatch)({
            service: setConfigService,
            success: function(oData) {
                dispatch(appConfig({
                    showUpdateModal: Number(oData.update) ? true : false,
                    showRecharge: Number(oData.recharge_switch) ? true: false,
                    isCidLogin: Number(oData.is_cid_login) ? true : false,
                    isEnforceUpdate: Number(oData.is_enforce_update) ? true : false,  //是否强制更新  0  不需要 1 需要
                    isNewModal: Number(oData.switch_two_zero_version) ? true : false,
                }));
            },
            error: function(oData) {

            }
        })
    }
}

export function setAppUserConfig() {  //获取登录后的配置
    return dispatch => {
        serviceAction(dispatch)({
            service: setUserConfigService,
            success: function(oData) {
                //oData.is_new = true;
                dispatch(appUserConfig({
                    isSignIn: Number(oData.is_signed_in) ? true : false,
                    isNew: Number(oData.is_new) ? true : false,
                    verifiedStatus: oData.verified_status || "0",
                    city: oData.city || {"name": "上海"}
                }));
            },
            error: function(oData) {

            }
        })
    }
}

export function setSearchHistory(uid) {
    return dispatch => {
        dispatch(setSearchHistoryKey(uid));

        let listKey = "list_search_history_" + uid,
            inputKey = "input_search_history_" + uid;

        AsyncStorageComponent.multiGet([listKey, inputKey])
            .then((value) => {
                let len = value.length, historyObj = {};
                for(let i=0; i<len; i++) {
                    switch (value[i][0]) {
                        case listKey:
                            historyObj.list = JSON.parse(value[i][1]) || [];
                            break;
                        case inputKey:
                            historyObj.input = JSON.parse(value[i][1]) || [];
                            break;
                    }
                }
                dispatch(getSearchHistory(historyObj));
            });
    }
}