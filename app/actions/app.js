'use strict';

import * as types from '../constants/App';
import {makeActionCreator, serviceAction} from './base';
import {setWebStartConfigService, deletePushService} from '../service/configService';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');
export const webNetWorkError = makeActionCreator(types.WEB_NETWORK_ERROR, 'msg');
export const webStartConfig = makeActionCreator(types.WEB_START_CONFIG, 'config');

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