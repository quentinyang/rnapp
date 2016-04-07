'use strict';

import * as types from '../constants/SettingsType';
import {fetchContactHouseService, fetchInputHouseService} from '../service/settingsService';
import {makeActionCreator} from './base';

export const contactHouseFetched = makeActionCreator(types.CONTACT_HOUSE_FETCHED, 'contactHouse');
export const inputHouseFetched = makeActionCreator(types.INPUT_HOUSE_FETCHED, 'inputHouse');
export const houseDataCleared = makeActionCreator(types.HOUSE_DATA_CLEARED);

export function fetchContactHouse(params) {
    return dispatch => {
        return fetchContactHouseService(params)
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(contactHouseFetched(oData))
            })
            .catch((error) => {
                //console.error('Ajax Error: ', error);
            })
    }
}

export function fetchInputHouse(params) {
    return dispatch => {
        return fetchInputHouseService(params)
            .then((oData) => {
                console.info('Ajax Success: ', oData);
                dispatch(inputHouseFetched(oData))
            })
            .catch((error) => {
                //console.error('Ajax Error: ', error);
            })
    }
}


