'use strict';

import * as types from '../constants/HouseList';
import {fetchHouseListService, fetchAppendHouseListService, fetchPrependHouseListService} from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseFetched = makeActionCreator(types.HOUSE_FETCHED, 'houseList');
export const houseAppendFetched = makeActionCreator(types.HOUSE_APPEND_FETCHED, 'houseList');
export const housePrependFetched = makeActionCreator(types.HOUSE_PREPEND_FETCHED, 'houseList');

export function fetchHouseList(params) {
    return dispatch => {
        return fetchHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

export function fetchAppendHouseList(params) {
    return dispatch => {
        return fetchAppendHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseAppendFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

export function fetchPrependHouseList(params) {
    return dispatch => {
        return fetchPrependHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(housePrependFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}


