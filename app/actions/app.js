'use strict';

import * as types from '../constants/App';
import {makeActionCreator, serviceAction} from './base';
import {setWebStartConfigService, deletePushService, setConfigService} from '../service/configService';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');
export const webNetWorkError = makeActionCreator(types.WEB_NETWORK_ERROR, 'msg');
export const webStartConfig = makeActionCreator(types.WEB_START_CONFIG, 'config');
export const appConfig = makeActionCreator(types.APP_CONFIG, 'appConfig');
export const closeUpdateModal = makeActionCreator(types.CLOSE_UPDATE_MODAL, 'visible');

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
                    showUpdateModal: Number(oData.update) ? true : false
                }));
            },
            error: function(oData) {

            }
        })
    }
}