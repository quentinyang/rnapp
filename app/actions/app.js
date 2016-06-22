'use strict';

import * as types from '../constants/App';
import {makeActionCreator, serviceAction} from './base';
import {setWebStartConfigService, deletePushService, setConfigService} from '../service/configService';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');
export const webNetWorkError = makeActionCreator(types.WEB_NETWORK_ERROR, 'msg');
export const webStartConfig = makeActionCreator(types.WEB_START_CONFIG, 'config');
export const appConfig = makeActionCreator(types.APP_CONFIG, 'appConfig');
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
                    isEnforceUpdate: Number(oData.is_enforce_update) ? true : false  //是否强制更新  0  不需要 1 需要
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