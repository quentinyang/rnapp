'use strict';

import * as types from '../constants/Home';
import {fetchAttentionHouseListService, fetchAttentionAppendHouseListService, fetchAttentionPrependHouseListService} from '../service/houseListService';
import {makeActionCreator} from './base';

export const houseAttentionFetched = makeActionCreator(types.HOUSE_ATTENTION_FETCHED, 'houseList');
export const houseAttentionAppendFetched = makeActionCreator(types.HOUSE_ATTENTION_APPEND_FETCHED, 'houseList');
export const houseAttentionPrependFetched = makeActionCreator(types.HOUSE_ATTENTION_PREPEND_FETCHED, 'houseList');

export function fetchAttentionHouseList(params) {
    return dispatch => {
        return fetchAttentionHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseAttentionFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

export function fetchAttentionAppendHouseList(params) {
    return dispatch => {
        return fetchAttentionAppendHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseAttentionAppendFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

export function fetchAttentionPrependHouseList(params) {
    return dispatch => {
        return fetchAttentionPrependHouseListService()
            .then((oData) => {
                console.info('Ajax Success: ' + oData);
                dispatch(houseAttentionPrependFetched(oData))
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
    }
}

