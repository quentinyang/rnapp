'use strict';

import * as types from '../constants/SettingsType';
import {fetchContactHouseService, fetchInputHouseService} from '../service/settingsService';
import {makeActionCreator, serviceAction} from './base';

export const contactHouseFetched = makeActionCreator(types.CONTACT_HOUSE_FETCHED, 'contactHouse');
export const contactHousePrependFetched = makeActionCreator(types.CONTACT_HOUSE_PREPEND_FETCHED, 'contactHouse');
export const inputHouseFetched = makeActionCreator(types.INPUT_HOUSE_FETCHED, 'inputHouse');
export const inputHousePrependFetched = makeActionCreator(types.INPUT_HOUSE_PREPEND_FETCHED, 'inputHouse');
export const houseDataCleared = makeActionCreator(types.HOUSE_DATA_CLEARED);

export function fetchContactHouse(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchContactHouseService,
            data: params,
            success: function(oData) {
                dispatch(contactHouseFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchPrependContactHouse(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchContactHouseService,
            data: params,
            success: function(oData) {
                dispatch(contactHousePrependFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchInputHouse(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchInputHouseService,
            data: params,
            success: function(oData) {
                dispatch(inputHouseFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}

export function fetchPrependInputHouse(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchInputHouseService,
            data: params,
            success: function(oData) {
                dispatch(inputHousePrependFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}
